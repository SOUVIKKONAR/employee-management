from rest_framework import serializers
from .models import (
    EmployeeProject, Employee, Department, Designation, Address, 
    Attendance, Leave, Payroll, Project, UserProfile, LeaveBalance, 
    Notification, Document, Holiday
)

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'username', 'role']

class EmployeeSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source='department.dept_name',
        read_only=True
    )

    designation_name = serializers.CharField(
        source='designation.designation_name',
        read_only=True
    )

    manager_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}"
        return None

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    total_days = serializers.ReadOnlyField()

    class Meta:
        model = Leave
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    remaining = serializers.ReadOnlyField()

    class Meta:
        model = LeaveBalance
        fields = '__all__'
        
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    net_salary = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Payroll
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class EmployeeProjectSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    project_name = serializers.CharField(
        source='project.project_name', read_only=True
    )

    class Meta:
        model = EmployeeProject
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Document
        fields = '__all__'
        
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'