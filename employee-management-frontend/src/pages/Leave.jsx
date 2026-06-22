import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const APPROVAL_BADGE = { Pending: "warning", Approved: "success", Rejected: "danger" };
const LEAVE_TYPES = ["Casual Leave", "Sick Leave", "Earned Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];

function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");

    const [form, setForm] = useState({
        employee: "", leave_type: "Casual Leave", start_date: "", end_date: "", reason: "", approval_status: "Pending",
    });

    const loadData = () => {
        setLoading(true);
        let url = "leaves/";
        if (filterStatus) url += `?approval_status=${filterStatus}`;
        Promise.all([api.get(url), api.get("employees/?page_size=1000")])
            .then(([lv, emp]) => {
                setLeaves(lv.data.results ?? lv.data);
                setEmployees(emp.data.results ?? emp.data);
            })
            .catch(() => toast.error("Failed to load leave data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, [filterStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.end_date < form.start_date) {
            toast.error("End date cannot be before start date");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("leaves/", form);
            toast.success("Leave application submitted! 🏖️");
            setShowForm(false);
            setForm({ employee: "", leave_type: "Casual Leave", start_date: "", end_date: "", reason: "", approval_status: "Pending" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to submit leave");
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`leaves/${id}/`, { approval_status: status });
            toast.success(`Leave ${status.toLowerCase()} ✅`);
            loadData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this leave record?")) return;
        try {
            await api.delete(`leaves/${id}/`);
            toast.success("Leave record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>🏖️ Leave Management</h1>
                        <p className="text-muted mb-0">Apply, approve, or reject leave requests</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                        <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ borderRadius: "10px", width: "160px" }}>
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <button className="btn fw-semibold" onClick={() => setShowForm(!showForm)}
                            style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px" }}>
                            {showForm ? "✕ Cancel" : "➕ Apply Leave"}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)" }}>
                            <h5 className="mb-0 fw-bold text-white">Leave Application</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-muted small">Employee *</label>
                                        <select className="form-select" value={form.employee} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, employee: e.target.value })}>
                                            <option value="">Select Employee</option>
                                            {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-muted small">Leave Type *</label>
                                        <select className="form-select" value={form.leave_type} style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
                                            {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">From *</label>
                                        <input type="date" className="form-control" value={form.start_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">To *</label>
                                        <input type="date" className="form-control" value={form.end_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-muted small">Reason *</label>
                                        <textarea className="form-control" rows={3} value={form.reason} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for leave..." />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4"
                                            style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : "📤 Submit Application"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="card border-0 shadow-sm" style={{ borderRadius: "14px", overflow: "hidden" }}>
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5"><div className="spinner-border text-primary" /><p className="mt-3 text-muted">Loading...</p></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "white" }}>
                                        <tr>
                                            {["#", "Employee", "Leave Type", "From", "To", "Days", "Reason", "Status", "Actions"].map((h) => (
                                                <th key={h} className="py-3 px-3 fw-semibold border-0">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.length > 0 ? leaves.map((l, i) => (
                                            <tr key={l.id}>
                                                <td className="px-3 text-muted">{i + 1}</td>
                                                <td className="px-3 fw-semibold">{l.employee_name}</td>
                                                <td className="px-3"><span className="badge bg-info text-dark">{l.leave_type}</span></td>
                                                <td className="px-3">{l.start_date}</td>
                                                <td className="px-3">{l.end_date}</td>
                                                <td className="px-3"><span className="badge bg-secondary">{l.total_days} day{l.total_days !== 1 ? "s" : ""}</span></td>
                                                <td className="px-3" style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                                    title={l.reason}>{l.reason}</td>
                                                <td className="px-3">
                                                    <span className={`badge bg-${APPROVAL_BADGE[l.approval_status] ?? "secondary"}`}>{l.approval_status}</span>
                                                </td>
                                                <td className="px-3">
                                                    <div className="d-flex gap-1">
                                                        {l.approval_status === "Pending" && (
                                                            <>
                                                                <button className="btn btn-sm" onClick={() => updateStatus(l.id, "Approved")}
                                                                    style={{ background: "#43e97b", color: "white", borderRadius: "8px" }}>✓</button>
                                                                <button className="btn btn-sm" onClick={() => updateStatus(l.id, "Rejected")}
                                                                    style={{ background: "#f5576c", color: "white", borderRadius: "8px" }}>✗</button>
                                                            </>
                                                        )}
                                                        <button className="btn btn-sm" onClick={() => handleDelete(l.id)}
                                                            style={{ background: "#aaa", color: "white", borderRadius: "8px" }}>🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="9" className="text-center py-5 text-muted">
                                                <div style={{ fontSize: "3rem" }}>🏖️</div><p>No leave records found</p>
                                            </td></tr>
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

export default Leave;
