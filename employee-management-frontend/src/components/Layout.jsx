import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationPanel from "./NotificationPanel";
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Umbrella,
    Wallet,
    Rocket,
    Building2,
    Bell,
    Menu,
} from "lucide-react";

// Bottom nav items (5 most important)
const bottomNavItems = [
    { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { path: "/", label: "Employees", Icon: Users },
    { path: "/attendance", label: "Attendance", Icon: CalendarCheck },
    { path: "/leave", label: "Leave", Icon: Umbrella },
    { path: "/payroll", label: "Payroll", Icon: Wallet },
];

function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ minHeight: "100vh" }}>

            {/* ── Mobile sidebar overlay ─────────────────────────────── */}
            <div
                className={`sidebar-overlay${isSidebarOpen ? " active" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNotificationClick={() => setIsNotificationOpen(true)}
            />

            {/* ── Mobile top header ─────────────────────────────────── */}
            <header className="mobile-header">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    style={{ flex: 1 }}
                >
                    <div style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        padding: "6px",
                        borderRadius: "8px",
                    }}>
                        <Building2 size={18} color="white" />
                    </div>
                    <span style={{
                        background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "700",
                        fontSize: "1rem",
                    }}>
                        EMS Portal
                    </span>
                </Link>

                {/* Bell */}
                <button
                    onClick={() => setIsNotificationOpen(true)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </button>
            </header>

            {/* ── Main content ──────────────────────────────────────── */}
            <main
                className="layout-main"
                style={{
                    marginLeft: "var(--sidebar-width)",
                    width: "calc(100% - var(--sidebar-width))",
                    minWidth: 0,
                    padding: "24px",
                }}
            >
                {children}
            </main>

            {/* ── Bottom nav (mobile only) ──────────────────────────── */}
            <nav className="bottom-nav">
                {bottomNavItems.map(({ path, label, Icon }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`bottom-nav-item${isActive(path) ? " active" : ""}`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            {/* ── Notification panel ────────────────────────────────── */}
            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            />
        </div>
    );
}

export default Layout;
