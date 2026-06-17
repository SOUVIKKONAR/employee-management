import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function AddEmployee() {

    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);

    const [employee, setEmployee] = useState({
        emp_code: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        gender: "Male",
        dob: "",
        joining_date: "",
        salary: "",
        status: "Active",
        department: "",
        designation: ""
    });

    useEffect(() => {

        loadDepartments();
        loadDesignations();

    }, []);

    const loadDepartments = async () => {

        try {

            const response = await api.get("departments/");

            setDepartments(
                response.data.results || response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const loadDesignations = async () => {

        try {

            const response = await api.get("designations/");

            setDesignations(
                response.data.results || response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const handleChange = (e) => {

        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "employees/",
                employee
            );

            alert(
                "Employee Added Successfully"
            );

            navigate("/");

        } catch (error) {

            console.log(
                error.response?.data
            );

            alert(
                JSON.stringify(
                    error.response?.data,
                    null,
                    2
                )
            );
        }
    };

    return (

        <div className="container mt-5">

            <div className="card shadow-lg">

                <div className="card-header bg-success text-white">

                    <h3 className="mb-0">
                        Add Employee
                    </h3>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Employee Code
                                </label>

                                <input
                                    type="text"
                                    name="emp_code"
                                    className="form-control"
                                    value={employee.emp_code}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    value={employee.first_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    value={employee.last_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={employee.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone_no"
                                    className="form-control"
                                    value={employee.phone_no}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    className="form-select"
                                    value={employee.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Date Of Birth
                                </label>

                                <input
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    value={employee.dob}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joining_date"
                                    className="form-control"
                                    value={employee.joining_date}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Salary
                                </label>

                                <input
                                    type="number"
                                    name="salary"
                                    className="form-control"
                                    value={employee.salary}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Department
                                </label>

                                <select
                                    name="department"
                                    className="form-select"
                                    value={employee.department}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map((dept) => (

                                        <option
                                            key={dept.id}
                                            value={dept.id}
                                        >
                                            {dept.dept_name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Designation
                                </label>

                                <select
                                    name="designation"
                                    className="form-select"
                                    value={employee.designation}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Designation
                                    </option>

                                    {designations.map((des) => (

                                        <option
                                            key={des.id}
                                            value={des.id}
                                        >
                                            {des.designation_name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Save Employee
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default AddEmployee;