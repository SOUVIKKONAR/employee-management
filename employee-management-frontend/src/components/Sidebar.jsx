import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Umbrella,
    Wallet,
    Rocket,
    Building2,
    LogOut,
    FileText,
    Settings,
    Bell
} from "lucide-react";

function Sidebar({ onNotificationClick }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/", label: "Employees", Icon: Users },
        { path: "/attendance", label: "Attendance", Icon: CalendarCheck },
        { path: "/leave", label: "Leave", Icon: Umbrella },
        { path: "/payroll", label: "Payroll", Icon: Wallet },
        { path: "/projects", label: "Projects", Icon: Rocket },
        { path: "/reports", label: "Reports", Icon: FileText },
        { path: "/settings", label: "Settings", Icon: Settings },
    ];

    return (
        <div style={{
            width: "var(--sidebar-width)",
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--border)",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 1000
        }}>
            <div className="p-4 d-flex align-items-center gap-2 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "8px", borderRadius: "10px" }}>
                    <Building2 size={24} color="white" />
                </div>
                <span className="fw-bold fs-5" style={{ background: "linear-gradient(90deg, #60a5fa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    EMS Portal
                </span>
            </div>

            <div className="flex-grow-1 overflow-auto px-3">
                <ul className="nav flex-column gap-2">
                    {navItems.map(({ path, label, Icon }) => (
                        <li className="nav-item" key={path}>
                            <Link
                                to={path}
                                className="nav-link d-flex align-items-center gap-3"
                                style={{
                                    color: isActive(path) ? "white" : "var(--text-secondary)",
                                    background: isActive(path) ? "rgba(59, 130, 246, 0.15)" : "transparent",
                                    borderRadius: "10px",
                                    padding: "10px 16px",
                                    fontWeight: isActive(path) ? "600" : "500",
                                    transition: "all 0.2s"
                                }}
                            >
                                <Icon size={20} color={isActive(path) ? "#60a5fa" : "currentColor"} />
                                {label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item">
                        <button
                            className="nav-link d-flex align-items-center gap-3 w-100 border-0 text-start"
                            style={{
                                color: "var(--text-secondary)",
                                background: "transparent",
                                borderRadius: "10px",
                                padding: "10px 16px",
                                fontWeight: "500",
                                transition: "all 0.2s"
                            }}
                            onClick={onNotificationClick}
                        >
                            <Bell size={20} color="currentColor" />
                            Notifications
                        </button>
                    </li>
                </ul>
            </div>

            <div className="p-3 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                    onClick={handleLogout}
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px" }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
