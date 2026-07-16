from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(
    'employees',
    EmployeeViewSet
)

router.register(
    'departments',
    DepartmentViewSet
)

router.register(
    'designations',
    DesignationViewSet
)

router.register('addresses', AddressViewSet)
router.register('payrolls', PayrollViewSet)
router.register('projects', ProjectViewSet)
router.register('employee-projects', EmployeeProjectViewSet)
router.register('attendance', AttendanceViewSet)
router.register('leaves', LeaveViewSet)
router.register('user-profiles', UserProfileViewSet)
router.register('leave-balances', LeaveBalanceViewSet)
router.register('notifications', NotificationViewSet)
router.register('documents', DocumentViewSet)
router.register('holidays', HolidayViewSet)

urlpatterns = [path('signup/', SignupView.as_view(), name='signup')] + router.urls
