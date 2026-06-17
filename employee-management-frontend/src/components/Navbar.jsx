import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container-fluid">

                <Link
                    className="navbar-brand"
                    to="/"
                >
                    Employee Management System
                </Link>

                <div className="navbar-nav">

                    <Link
                        className="nav-link"
                        to="/dashboard"
                    >
                        Dashboard
                    </Link>

                    <Link
                        className="nav-link"
                        to="/"
                    >
                        Employees
                    </Link>

                    <Link
                        className="nav-link"
                        to="/attendance"
                    >
                        Attendance
                    </Link>

                    <Link
                        className="nav-link"
                        to="/leave"
                    >
                        Leave
                    </Link>

                    <Link
                        className="nav-link"
                        to="/payroll"
                    >
                        Payroll
                    </Link>

                </div>

                <button
                    className="btn btn-danger"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;