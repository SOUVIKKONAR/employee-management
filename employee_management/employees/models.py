from django.db import models


class Department(models.Model):
    dept_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.dept_name
    
class Designation(models.Model):
    designation_name = models.CharField(max_length=100)
    grade = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.designation_name

class Employee(models.Model):

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other')
    ]

    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive')
    ]

    emp_code = models.CharField(max_length=20, unique=True)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    from django.core.validators import RegexValidator

    phone_validator = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message='Phone number must start with 6-9 and contain exactly 10 digits'
    )

    phone_no = models.CharField(
        max_length=10,
        validators=[phone_validator],
         unique=True
    )
    email = models.EmailField(unique=True)
    

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    dob = models.DateField()

    joining_date = models.DateField()

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE
    )

    designation = models.ForeignKey(
        Designation,
        on_delete=models.CASCADE
    )

    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Address(models.Model):

    employee = models.OneToOneField(
        Employee,
        on_delete=models.CASCADE
    )

    address_line1 = models.CharField(max_length=255)

    address_line2 = models.CharField(
        max_length=255,
        blank=True
    )

    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    country = models.CharField(max_length=100)

    pincode = models.CharField(max_length=10)

    def __str__(self):
        return self.city
    
class Attendance(models.Model):

    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Half-Day', 'Half-Day')
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE
    )

    att_date = models.DateField()

    check_in = models.TimeField()

    check_out = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )
    
class Leave(models.Model):

    APPROVAL_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE
    )

    leave_type = models.CharField(max_length=50)

    start_date = models.DateField()

    end_date = models.DateField()

    reason = models.TextField()

    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_CHOICES
    )

class Payroll(models.Model):

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE
    )

    month = models.CharField(max_length=20)

    basic_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    bonus = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    deduction = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    net_salary = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_date = models.DateField()
    
class Project(models.Model):

    project_name = models.CharField(max_length=100)

    description = models.TextField()

    start_date = models.DateField()

    end_date = models.DateField()

    def __str__(self):
        return self.project_name

