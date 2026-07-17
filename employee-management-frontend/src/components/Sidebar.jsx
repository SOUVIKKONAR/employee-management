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
    Bell,
    X
} from "lucide-react";

function Sidebar({ onNotificationClick, isOpen, onClose }) {
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

    // Close sidebar on mobile when a nav link is clicked
    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <div
            className={`sidebar-root${isOpen ? " is-open" : ""}`}
            style={{
                width: "var(--sidebar-width)",
                background: "var(--bg-surface)",
                borderRight: "1px solid var(--border)",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                display: "flex",
                flexDirection: "column",
                zIndex: 1200,
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            {/* Logo + mobile close button */}
            <div
                className="sidebar-logo p-4 d-flex align-items-center gap-2 mb-2"
                style={{ borderBottom: "1px solid var(--border)", minHeight: "64px" }}
            >
                <div style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "7px", borderRadius: "10px", flexShrink: 0 }}>
                    <Building2 size={22} color="white" />
                </div>
                <span
                    className="sidebar-logo-text fw-bold fs-5"
                    style={{
                        background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}
                >
                    EMS Portal
                </span>

                {/* Close button — only visible on mobile */}
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: "auto",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "none", // shown via CSS on mobile
                        padding: "4px",
                        borderRadius: "6px",
                    }}
                    className="sidebar-close-btn"
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Nav items */}
            <div className="flex-grow-1 overflow-auto px-2 py-1">
                <ul className="nav flex-column gap-1">
                    {navItems.map(({ path, label, Icon }) => (
                        <li className="nav-item" key={path}>
                            <Link
                                to={path}
                                onClick={handleNavClick}
                                className="sidebar-nav-link nav-link d-flex align-items-center gap-3"
                                style={{
                                    color: isActive(path) ? "white" : "var(--text-secondary)",
                                    background: isActive(path)
                                        ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1))"
                                        : "transparent",
                                    borderRadius: "10px",
                                    padding: "10px 14px",
                                    fontWeight: isActive(path) ? "600" : "500",
                                    transition: "all 0.2s",
                                    borderLeft: isActive(path) ? "3px solid #3b82f6" : "3px solid transparent",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <Icon size={19} color={isActive(path) ? "#60a5fa" : "currentColor"} style={{ flexShrink: 0 }} />
                                <span className="sidebar-label">{label}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Notifications */}
                    <li className="nav-item">
                        <button
                            className="sidebar-nav-link nav-link d-flex align-items-center gap-3 w-100 border-0 text-start"
                            style={{
                                color: "var(--text-secondary)",
                                background: "transparent",
                                borderRadius: "10px",
                                padding: "10px 14px",
                                fontWeight: "500",
                                transition: "all 0.2s",
                                borderLeft: "3px solid transparent",
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                            }}
                            onClick={() => { onNotificationClick?.(); handleNavClick(); }}
                        >
                            <Bell size={19} color="currentColor" style={{ flexShrink: 0 }} />
                            <span className="sidebar-label">Notifications</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Logout */}
            <div className="p-3 mt-auto" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                    onClick={handleLogout}
                    className="sidebar-logout btn w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                        background: "rgba(239,68,68,0.1)",
                        color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: "10px",
                        whiteSpace: "nowrap",
                    }}
                >
                    <LogOut size={17} style={{ flexShrink: 0 }} />
                    <span className="sidebar-logout-text">Logout</span>
                </button>
            </div>

            <style>{`
                /* Show close button only on mobile */
                @media (max-width: 767px) {
                    .sidebar-close-btn { display: block !important; }
                }
                /* Hover effect */
                .sidebar-nav-link:hover {
                    background: rgba(59,130,246,0.08) !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
}

export default Sidebar;
