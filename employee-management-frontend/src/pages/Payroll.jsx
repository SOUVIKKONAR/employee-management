import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function Payroll() {
    const [payrolls, setPayrolls] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterEmp, setFilterEmp] = useState("");

    const currentYear = new Date().getFullYear();
    const currentMonth = MONTHS[new Date().getMonth()];

    const [form, setForm] = useState({
        employee: "",
        month: `${currentMonth} ${currentYear}`,
        basic_salary: "",
        bonus: "0",
        deduction: "0",
        payment_date: new Date().toISOString().split("T")[0],
    });

    const loadData = () => {
        setLoading(true);
        let url = "payrolls/";
        if (filterEmp) url += `?employee=${filterEmp}`;
        Promise.all([api.get(url), api.get("employees/?page_size=1000")])
            .then(([pay, emp]) => {
                setPayrolls(pay.data.results ?? pay.data);
                setEmployees(emp.data.results ?? emp.data);
            })
            .catch(() => toast.error("Failed to load payroll data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, [filterEmp]);

    const netPreview =
        parseFloat(form.basic_salary || 0) +
        parseFloat(form.bonus || 0) -
        parseFloat(form.deduction || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(form.basic_salary) <= 0) {
            toast.error("Basic salary must be greater than zero");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("payrolls/", form);
            toast.success("Payroll entry created! 💰");
            setShowForm(false);
            setForm({
                employee: "",
                month: `${currentMonth} ${currentYear}`,
                basic_salary: "",
                bonus: "0",
                deduction: "0",
                payment_date: new Date().toISOString().split("T")[0],
            });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to create payroll entry");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this payroll record?")) return;
        try {
            await api.delete(`payrolls/${id}/`);
            toast.success("Payroll record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const fmt = (val) =>
        Number(val).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>💰 Payroll</h1>
                        <p className="text-muted mb-0">Manage monthly salary disbursements</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                        <select className="form-select" value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)}
                            style={{ borderRadius: "10px", width: "200px" }}>
                            <option value="">All Employees</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                            ))}
                        </select>
                        <button className="btn fw-semibold" onClick={() => setShowForm(!showForm)}
                            style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px" }}>
                            {showForm ? "✕ Cancel" : "➕ Add Payroll"}
                        </button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}>
                            <h5 className="mb-0 fw-bold text-white">New Payroll Entry</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-muted small">Employee *</label>
                                        <select className="form-select" value={form.employee} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, employee: e.target.value })}>
                                            <option value="">Select Employee</option>
                                            {employees.map((e) => (
                                                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-muted small">Month *</label>
                                        <input type="text" className="form-control" value={form.month} required style={{ borderRadius: "10px" }}
                                            placeholder="e.g. June 2025"
                                            onChange={(e) => setForm({ ...form, month: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Payment Date *</label>
                                        <input type="date" className="form-control" value={form.payment_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-muted small">Basic Salary (₹) *</label>
                                        <input type="number" className="form-control" value={form.basic_salary} required min="1" style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, basic_salary: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-muted small">Bonus (₹)</label>
                                        <input type="number" className="form-control" value={form.bonus} min="0" style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, bonus: e.target.value })} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold text-muted small">Deduction (₹)</label>
                                        <input type="number" className="form-control" value={form.deduction} min="0" style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, deduction: e.target.value })} />
                                    </div>
                                    <div className="col-md-3 d-flex align-items-end">
                                        <div className="w-100 p-3 rounded-3 text-center fw-bold"
                                            style={{ background: netPreview >= 0 ? "#d1fae5" : "#fee2e2", color: netPreview >= 0 ? "#065f46" : "#991b1b", fontSize: "1.1rem" }}>
                                            Net: {fmt(netPreview)}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4"
                                            style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "💾 Save Payroll"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: "14px", overflow: "hidden" }}>
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" />
                                <p className="mt-3 text-muted">Loading payroll data...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "white" }}>
                                        <tr>
                                            {["#", "Employee", "Month", "Basic", "Bonus", "Deduction", "Net Salary", "Payment Date", "Actions"].map((h) => (
                                                <th key={h} className="py-3 px-3 fw-semibold border-0" style={{ whiteSpace: "nowrap" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrolls.length > 0 ? payrolls.map((p, i) => (
                                            <tr key={p.id}>
                                                <td className="px-3 text-muted">{i + 1}</td>
                                                <td className="px-3 fw-semibold">{p.employee_name}</td>
                                                <td className="px-3"><span className="badge bg-light text-dark border">{p.month}</span></td>
                                                <td className="px-3">{fmt(p.basic_salary)}</td>
                                                <td className="px-3 text-success">+{fmt(p.bonus)}</td>
                                                <td className="px-3 text-danger">-{fmt(p.deduction)}</td>
                                                <td className="px-3 fw-bold" style={{ color: "#065f46" }}>{fmt(p.net_salary)}</td>
                                                <td className="px-3">{p.payment_date}</td>
                                                <td className="px-3">
                                                    <button className="btn btn-sm" onClick={() => handleDelete(p.id)}
                                                        style={{ background: "#f5576c", color: "white", borderRadius: "8px" }}>
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5 text-muted">
                                                    <div style={{ fontSize: "3rem" }}>💰</div>
                                                    <p>No payroll records found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payroll;
