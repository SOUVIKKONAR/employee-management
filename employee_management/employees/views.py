from django.shortcuts import render
from rest_framework import filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import (
    Employee, Department, Designation, Address,
    Attendance, Leave, Payroll, Project, EmployeeProject
)
from .serializers import (
    EmployeeSerializer, DepartmentSerializer, DesignationSerializer,
    AddressSerializer, AttendanceSerializer, LeaveSerializer,
    PayrollSerializer, ProjectSerializer, EmployeeProjectSerializer,
)


class LargeResultsSetPagination(PageNumberPagination):
    """Used for dropdown loaders — allows ?page_size=1000."""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EmployeeViewSet(viewsets.ModelViewSet):

    queryset = Employee.objects.select_related(
        'department', 'designation', 'manager'
    ).all()
    serializer_class = EmployeeSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'designation', 'status', 'gender']
    search_fields = ['emp_code', 'first_name', 'last_name', 'email']
    ordering_fields = ['first_name', 'joining_date', 'salary', 'created_at']
    ordering = ['-created_at']


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


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('employee').all()
    serializer_class = LeaveSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'approval_status', 'leave_type']
    ordering_fields = ['start_date', 'approval_status']
    ordering = ['-start_date']


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.select_related('employee').all()
    serializer_class = PayrollSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['employee', 'month']
    ordering_fields = ['payment_date', 'net_salary']
    ordering = ['-payment_date']


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['project_name']
    ordering_fields = ['start_date', 'end_date', 'project_name']
    ordering = ['-start_date']


class EmployeeProjectViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProject.objects.select_related('employee', 'project').all()
    serializer_class = EmployeeProjectSerializer
    pagination_class = LargeResultsSetPagination

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'project']
