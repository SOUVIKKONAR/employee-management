from django.shortcuts import render
from rest_framework import filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import (
    Employee,
    Department,
    Designation,
    Address,
    Attendance,
    Leave,
    Payroll,
    Project,
    EmployeeProject
)
from .serializers import (
    EmployeeSerializer,
    DepartmentSerializer,
    DesignationSerializer,
    AddressSerializer,
    AttendanceSerializer,
    LeaveSerializer,
    PayrollSerializer,
    ProjectSerializer,
    EmployeeProjectSerializer,
)

class EmployeeViewSet(viewsets.ModelViewSet):
    
    permission_classes = [AllowAny]

    queryset = Employee.objects.all()

    serializer_class = EmployeeSerializer

    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter
    ]

    filterset_fields = [
        'department',
        'designation',
        'status'
    ]

    search_fields = [
        'emp_code',
        'first_name',
        'last_name',
        'email'
    ]
    
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
class DesignationViewSet(viewsets.ModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    
class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class EmployeeProjectViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProject.objects.all()
    serializer_class = EmployeeProjectSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    
class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
# Create your views here.
