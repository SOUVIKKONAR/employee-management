import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

function EmployeeList() {

    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    function loadEmployees(page = 1, search = searchTerm) {

        let url = `employees/?page=${page}`;

        if (search.trim() !== "") {
            url += `&search=${search}`;
        }

        api.get(url)

            .then((response) => {

                setEmployees(response.data.results);

                setNextPage(response.data.next);

                setPreviousPage(response.data.previous);

                setCurrentPage(page);

            })

            .catch((error) => {

                console.log(error);

            });
    }

    useEffect(() => {

        loadEmployees(1);

    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`employees/${id}/`);

            alert("Employee deleted successfully");

            loadEmployees(currentPage);

        } catch (error) {

            console.log(error);

            alert("Failed to delete employee");
        }
    };

    const handleSearch = () => {

        loadEmployees(1, searchTerm);

    };

    return (

        <>
            <Navbar />

            <div className="container mt-5">

                {/* Header */}

                <div className="text-center mb-5">

                    <h1 className="fw-bold text-dark">
                        Employee Management System
                    </h1>

                    <hr className="w-50 mx-auto" />

                    <p className="lead text-secondary">
                        Manage your organization's employees efficiently
                    </p>

                </div>

                {/* Search + Add Button */}

                <div className="row mb-3">

                    <div className="col-md-8">

                        <div className="input-group">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Employee Code, Name or Email..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />

                            <button
                                className="btn btn-primary"
                                onClick={handleSearch}
                            >
                                Search
                            </button>

                        </div>

                    </div>

                    <div className="col-md-4 text-end">

                        <Link
                            to="/add"
                            className="btn btn-success"
                        >
                            + Add Employee
                        </Link>

                    </div>

                </div>

                {/* Employee Table */}

                <div className="card shadow-lg">

                    <div className="card-body">

                        <table className="table table-striped table-hover align-middle">

                            <thead className="table-dark">

                                <tr>
                                    <th>ID</th>
                                    <th>Employee Code</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {employees.length > 0 ? (

                                    employees.map((emp) => (

                                        <tr key={emp.id}>

                                            <td>{emp.id}</td>

                                            <td>{emp.emp_code}</td>

                                            <td>
                                                {emp.first_name} {emp.last_name}
                                            </td>

                                            <td>{emp.email}</td>

                                            <td>

                                                <Link
                                                    to={`/edit/${emp.id}`}
                                                    className="btn btn-warning btn-sm me-2"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(emp.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No Employees Found
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                        {/* Pagination */}

                        <div className="d-flex justify-content-center mt-4">

                            <button
                                className="btn btn-secondary me-2"
                                disabled={!previousPage}
                                onClick={() =>
                                    loadEmployees(currentPage - 1)
                                }
                            >
                                Previous
                            </button>

                            <span className="fw-bold align-self-center mx-3">
                                Page {currentPage}
                            </span>

                            <button
                                className="btn btn-secondary ms-2"
                                disabled={!nextPage}
                                onClick={() =>
                                    loadEmployees(currentPage + 1)
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );
}

export default EmployeeList;