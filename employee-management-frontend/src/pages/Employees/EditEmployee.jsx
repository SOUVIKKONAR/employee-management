import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

function EditEmployee() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [employee, setEmployee] = useState({});

    const [departments, setDepartments] = useState([]);

    const [designations, setDesignations] = useState([]);

    useEffect(() => {

        loadEmployee();
        loadDepartments();
        loadDesignations();

    }, []);

    const loadEmployee = async () => {

        try {

            const response =
                await api.get(`employees/${id}/`);

            setEmployee(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const loadDepartments = async () => {

        try {

            const response =
                await api.get("departments/");

            setDepartments(
                response.data.results ||
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const loadDesignations = async () => {

        try {

            const response =
                await api.get("designations/");

            setDesignations(
                response.data.results ||
                response.data
            );

        } catch (error) {

            console.log(error);
        }
    };

    const handleChange = (e) => {

        setEmployee({

            ...employee,

            [e.target.name]:
                e.target.value

        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.put(
                `employees/${id}/`,
                employee
            );

            alert(
                "Employee Updated Successfully"
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

                <div className="card-header bg-primary text-white">

                    <h3 className="mb-0">
                        Edit Employee
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
                                    value={employee.emp_code || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="first_name"
                                    value={employee.first_name || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="last_name"
                                    value={employee.last_name || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={employee.email || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    name="phone_no"
                                    value={employee.phone_no || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={employee.gender || ""}
                                    onChange={handleChange}
                                    className="form-select"
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
                                    value={employee.dob || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Joining Date
                                </label>

                                <input
                                    type="date"
                                    name="joining_date"
                                    value={employee.joining_date || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Salary
                                </label>

                                <input
                                    type="number"
                                    name="salary"
                                    value={employee.salary || ""}
                                    onChange={handleChange}
                                    className="form-control"
                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Department
                                </label>

                                <select
                                    name="department"
                                    value={employee.department || ""}
                                    onChange={handleChange}
                                    className="form-select"
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
                                    value={employee.designation || ""}
                                    onChange={handleChange}
                                    className="form-select"
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
                            className="btn btn-primary"
                        >
                            Update Employee
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
}

export default EditEmployee;