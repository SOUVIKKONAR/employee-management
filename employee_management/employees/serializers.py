from rest_framework import serializers
from .models import EmployeeProject, Employee, Department, Designation, Address, Attendance, Leave, Payroll, Project

class EmployeeSerializer(serializers.ModelSerializer):

    department_name = serializers.CharField(
        source='department.dept_name',
        read_only=True
    )

    designation_name = serializers.CharField(
        source='designation.designation_name',
        read_only=True
    )

    class Meta:
        model = Employee
        fields = '__all__'
        
class DepartmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Department
        fields = '__all__'
        
class DesignationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Designation
        fields = '__all__'
        
class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = '__all__'
        
class LeaveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Leave
        fields = '__all__'
        
class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = '__all__'
        
class PayrollSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payroll
        fields = '__all__'
        
class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'
        
class EmployeeProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmployeeProject
        fields = '__all__'