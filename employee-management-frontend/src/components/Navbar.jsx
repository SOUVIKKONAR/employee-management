import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Umbrella,
    Wallet,
    Rocket,
    Building2,
    LogOut,
} from "lucide-react";

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

    const navItems = [
        { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/", label: "Employees", Icon: Users },
        { path: "/attendance", label: "Attendance", Icon: CalendarCheck },
        { path: "/leave", label: "Leave", Icon: Umbrella },
        { path: "/payroll", label: "Payroll", Icon: Wallet },
        { path: "/projects", label: "Projects", Icon: Rocket },
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", boxShadow: "0 2px 15px rgba(0,0,0,0.3)" }}>
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <Building2 size={22} style={{ color: "#667eea" }} />
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
                        {navItems.map(({ path, label, Icon }) => (
                            <li className="nav-item" key={path}>
                                <Link
                                    className={isActive(path)}
                                    to={path}
                                    style={{ borderRadius: "8px", padding: "6px 14px", transition: "background 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                    <Icon size={15} />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="btn btn-sm d-flex align-items-center gap-2"
                        onClick={handleLogout}
                        style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "8px", padding: "6px 18px", fontWeight: "600" }}
                    >
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;