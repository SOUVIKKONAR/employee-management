from django.shortcuts import render
from rest_framework import filters, viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count

from .models import (
    Employee, Department, Designation, Address,
    Attendance, Leave, Payroll, Project, EmployeeProject,
    UserProfile, LeaveBalance, Notification, Document, Holiday
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, DesignationSerializer,
    AddressSerializer, AttendanceSerializer, LeaveSerializer,
    PayrollSerializer, ProjectSerializer, EmployeeProjectSerializer,
    UserProfileSerializer, LeaveBalanceSerializer, NotificationSerializer,
    DocumentSerializer, HolidaySerializer, SignupSerializer
)



class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'id': user.id, 'username': user.username},
            status=status.HTTP_201_CREATED
        )

class LargeResultsSetPagination(PageNumberPagination):
    """Used for dropdown loaders — allows ?page_size=1000."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class EmployeeViewSet(viewsets.ModelViewSet):

    queryset = (
        Employee.objects.select_related(
            'department', 'designation', 'manager'
        )
        .only(
            'id',
            'emp_code',
            'first_name',
            'last_name',
            'email',
            'phone_no',
            'status',
            'joining_date',
            'department_id',
            'designation_id',
            'manager_id',
            'department__dept_name',
            'designation__designation_name',
            'manager__first_name',
            'manager__last_name',
        )
    )
    serializer_class = EmployeeSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'designation', 'status', 'gender']
    search_fields = ['emp_code', 'first_name', 'last_name', 'email']
    ordering_fields = ['first_name', 'joining_date', 'salary', 'created_at']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        emp_count = Employee.objects.count()
        dept_count = Department.objects.count()
        desig_count = Designation.objects.count()
        proj_count = Project.objects.count()
        
        return Response({
            'employees': emp_count,
            'departments': dept_count,
            'designations': desig_count,
            'projects': proj_count
        })

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    pagination_class = LargeResultsSetPagination


class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    pagination_class = LargeResultsSetPagination


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.select_related('employee').all()
    serializer_class = AddressSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('employee').all()
    serializer_class = AttendanceSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'att_date', 'status']
    ordering_fields = ['att_date', 'check_in']
    ordering = ['-att_date']

    @action(detail=False, methods=['get'])
    def attendance_summary(self, request):
        employee_id = request.query_params.get('employee_id')
        month = request.query_params.get('month') # e.g. 2026-07
        
        qs = self.queryset
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
        if month:
            qs = qs.filter(att_date__startswith=month)
            
        summary = qs.values('status').annotate(count=Count('status'))
        return Response(summary)

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('employee').all()
    serializer_class = LeaveSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'approval_status', 'leave_type']
    ordering_fields = ['start_date', 'approval_status']
    ordering = ['-start_date']

    @action(detail=True, methods=['patch'])
    def approve_leave(self, request, pk=None):
        leave = self.get_object()
        status_val = request.data.get('approval_status')
        if status_val not in ['Approved', 'Rejected']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
            
        leave.approval_status = status_val
        leave.save()
        
        if status_val == 'Approved':
            try:
                balance = LeaveBalance.objects.get(
                    employee=leave.employee, 
                    leave_type=leave.leave_type, 
                    year=leave.start_date.year
                )
                balance.used += leave.total_days
                balance.save()
            except LeaveBalance.DoesNotExist:
                pass # Or handle creation if needed
                
        return Response({'status': f'Leave {status_val}'})

class LeaveBalanceViewSet(viewsets.ModelViewSet):
    queryset = LeaveBalance.objects.select_related('employee').all()
    serializer_class = LeaveBalanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'year']

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'month']
    ordering_fields = ['payment_date', 'net_salary']
    ordering = ['-payment_date']
    
    @action(detail=False, methods=['get'])
    def payroll_summary(self, request):
        qs = self.queryset
        # Group by month and sum net_salary
        summary = qs.values('month').annotate(total=Sum('net_salary')).order_by('-payment_date')[:6]
        return Response(summary)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority']
    search_fields = ['project_name']
    ordering_fields = ['start_date', 'end_date', 'project_name']
    ordering = ['-start_date']


class EmployeeProjectViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProject.objects.select_related('employee', 'project').all()
    serializer_class = EmployeeProjectSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'project']

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.select_related('employee').all()
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'is_read']
    ordering = ['-created_at']

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
        
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        employee_id = request.data.get('employee_id')
        if employee_id:
            Notification.objects.filter(employee_id=employee_id, is_read=False).update(is_read=True)
            return Response({'status': 'all marked as read'})
        return Response({'error': 'employee_id required'}, status=status.HTTP_400_BAD_REQUEST)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.select_related('employee').all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']
    
class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    ordering = ['date']
