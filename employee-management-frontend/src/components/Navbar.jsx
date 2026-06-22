import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    const isActive = (path) =>
        location.pathname === path ? "nav-link active fw-semibold" : "nav-link";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", boxShadow: "0 2px 15px rgba(0,0,0,0.3)" }}>
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <span style={{ fontSize: "1.4rem" }}>🏢</span>
                    <span style={{ background: "linear-gradient(90deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        EMS Portal
                    </span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto me-3 gap-1">
                        {[
                            { path: "/dashboard", label: "📊 Dashboard" },
                            { path: "/", label: "👥 Employees" },
                            { path: "/attendance", label: "📅 Attendance" },
                            { path: "/leave", label: "🏖️ Leave" },
                            { path: "/payroll", label: "💰 Payroll" },
                            { path: "/projects", label: "🚀 Projects" },
                        ].map(({ path, label }) => (
                            <li className="nav-item" key={path}>
                                <Link className={isActive(path)} to={path}
                                    style={{ borderRadius: "8px", padding: "6px 14px", transition: "background 0.2s" }}>
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="btn btn-sm"
                        onClick={handleLogout}
                        style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "8px", padding: "6px 18px", fontWeight: "600" }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;