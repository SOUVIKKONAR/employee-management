import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import api from "../services/api";

const statCards = [
    { key: "employees", label: "Total Employees", icon: "👥", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { key: "departments", label: "Departments", icon: "🏢", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { key: "designations", label: "Designations", icon: "🏷️", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { key: "projects", label: "Projects", icon: "🚀", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
];

function Dashboard() {
    const [stats, setStats] = useState({ employees: "–", departments: "–", designations: "–", projects: "–" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpoints = ["employees", "departments", "designations", "projects"];
        Promise.all(endpoints.map((e) => api.get(`${e}/`)))
            .then(([emp, dept, des, proj]) => {
                setStats({
                    employees: emp.data.count ?? emp.data.length,
                    departments: dept.data.count ?? dept.data.length,
                    designations: des.data.count ?? des.data.length,
                    projects: proj.data.count ?? proj.data.length,
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="mb-4">
                    <h1 className="fw-bold" style={{ color: "#1a1a2e" }}>Dashboard</h1>
                    <p className="text-muted">Overview of your organisation</p>
                </div>

                <div className="row g-4 mb-5">
                    {statCards.map(({ key, label, icon, gradient }) => (
                        <div className="col-md-6 col-xl-3" key={key}>
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden" }}>
                                <div className="card-body d-flex align-items-center gap-3 p-4" style={{ background: gradient }}>
                                    <div style={{ fontSize: "2.5rem" }}>{icon}</div>
                                    <div className="text-white">
                                        <div className="fs-2 fw-bold">
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm" role="status" />
                                            ) : stats[key]}
                                        </div>
                                        <div style={{ opacity: 0.9 }}>{label}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>Quick Links</h5>
                        <div className="row g-3">
                            {[
                                { href: "/add", label: "➕ Add Employee", color: "#667eea" },
                                { href: "/attendance", label: "📅 Log Attendance", color: "#f5576c" },
                                { href: "/leave", label: "🏖️ Manage Leave", color: "#43e97b" },
                                { href: "/payroll", label: "💰 View Payroll", color: "#4facfe" },
                            ].map(({ href, label, color }) => (
                                <div className="col-sm-6 col-md-3" key={href}>
                                    <a href={href} className="text-decoration-none d-block text-center py-3 rounded-3 fw-semibold"
                                        style={{ background: `${color}18`, color, border: `1.5px solid ${color}40`, transition: "all 0.2s" }}>
                                        {label}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;