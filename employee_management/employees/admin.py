from django.contrib import admin
from .models import *

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
    list_filter = ['role']

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['dept_name']
    search_fields = ['dept_name']

@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ['designation_name', 'grade']
    search_fields = ['designation_name']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['emp_code', 'first_name', 'last_name', 'department', 'designation', 'status']
    list_filter = ['status', 'department', 'gender']
    search_fields = ['emp_code', 'first_name', 'last_name', 'email']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['employee', 'city', 'state']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'att_date', 'check_in', 'check_out', 'status']
    list_filter = ['status', 'att_date']

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'start_date', 'end_date', 'approval_status']
    list_filter = ['approval_status', 'leave_type']

@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'leave_type', 'year', 'remaining']
    list_filter = ['year', 'leave_type']

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ['employee', 'month', 'net_salary', 'payment_date']
    list_filter = ['month']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_name', 'status', 'priority', 'start_date', 'end_date']
    list_filter = ['status', 'priority']
    search_fields = ['project_name']

@admin.register(EmployeeProject)
class EmployeeProjectAdmin(admin.ModelAdmin):
    list_display = ['employee', 'project', 'role', 'hours_allocated']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['employee', 'is_read', 'created_at']
    list_filter = ['is_read']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'name', 'uploaded_at']

@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ['name', 'date']
