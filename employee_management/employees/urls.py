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

urlpatterns = router.urls