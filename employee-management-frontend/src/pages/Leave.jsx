import { useState, useEffect } from "react";
import api from "../services/api";
import { Umbrella, Plus, X, Save, Trash2, Check, XCircle } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton } from "../components/SkeletonLoader";
import { toast } from "react-toastify";

const STATUS_BADGE = { Approved: "success", Rejected: "danger", Pending: "warning" };

function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [balances, setBalances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
    
    const [activeTab, setActiveTab] = useState("All");

    const [form, setForm] = useState({
        employee: "", leave_type: "Casual", start_date: "", end_date: "", reason: ""
    });

    const loadData = () => {
        setLoading(true);
        Promise.all([
            api.get("leaves/"),
            api.get("leave-balances/"),
            api.get("employees/?page_size=1000")
        ])
            .then(([lv, bal, emp]) => {
                setLeaves(lv.data.results ?? lv.data);
                setBalances(bal.data.results ?? bal.data);
                setEmployees(emp.data.results ?? emp.data);
            })
            .catch(() => toast.error("Failed to load leave data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.end_date < form.start_date) {
            toast.error("End date cannot be before start date");
            return;
        }
        
        setSubmitting(true);
        try {
            await api.post("leaves/", { ...form, approval_status: "Pending" });
            toast.success("Leave requested successfully!");
            setShowForm(false);
            setForm({ employee: "", leave_type: "Casual", start_date: "", end_date: "", reason: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to request leave");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const { id } = confirmModal;
        try {
            await api.delete(`leaves/${id}/`);
            toast.success("Leave record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete record");
        }
    };
    
    const updateStatus = async (id, status) => {
        try {
            await api.patch(`leaves/${id}/approve_leave/`, { approval_status: status });
            toast.success(`Leave ${status}`);
            loadData();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const filteredLeaves = activeTab === "All" ? leaves : leaves.filter(l => l.leave_type === activeTab);

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 page-header-row">
                <div>
                    <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <Umbrella size={28} className="text-warning" /> Leave Management
                    </h1>
                    <p className="text-muted mb-0">Manage employee leave requests</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><X size={16} />Cancel</> : <><Plus size={16} />Request Leave</>}
                </button>
            </div>

            {/* Balances Overview */}
            <div className="row g-3 mb-4">
                {balances.slice(0,4).map(b => (
                    <div className="col-6 col-md-3 leave-balance-col" key={b.id}>
                        <div className="card border-0 p-3 shadow-sm h-100">
                            <h6 className="fw-bold text-muted mb-2">{b.employee_name} ({b.leave_type})</h6>
                            <div className="d-flex justify-content-between align-items-end">
                                <div>
                                    <span className="fs-3 fw-bold">{b.remaining}</span>
                                    <span className="text-muted ms-1 small">remaining</span>
                                </div>
                                <div className="text-muted small">Total: {b.total_allocated}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="card mb-4 border-warning">
                    <div className="card-header border-bottom py-3">
                        <h6 className="mb-0 fw-bold">Request Leave</h6>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Employee *</label>
                                    <select className="form-select" value={form.employee} required onChange={(e) => setForm({ ...form, employee: e.target.value })}>
                                        <option value="">Select Employee</option>
                                        {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Leave Type *</label>
                                    <select className="form-select" value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
                                        <option value="Casual">Casual</option>
                                        <option value="Sick">Sick</option>
                                        <option value="Earned">Earned</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Start Date *</label>
                                    <input type="date" className="form-control" value={form.start_date} required onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">End Date *</label>
                                    <input type="date" className="form-control" value={form.end_date} required onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small">Reason</label>
                                    <textarea className="form-control" rows="2" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    <button type="submit" disabled={submitting} className="btn btn-primary px-4 d-flex align-items-center gap-2">
                                        {submitting ? <><span className="spinner-border spinner-border-sm" />Submitting...</> : <><Save size={16} />Submit Request</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="leave-tabs mb-3">
                {["All", "Casual", "Sick", "Earned"].map(tab => (
                    <button 
                        key={tab}
                        className={`btn btn-sm rounded-pill px-4 ${activeTab === tab ? "btn-primary fw-bold" : "btn-outline-secondary"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card">
                <div className="card-body p-0">
                    {loading ? (
                        <TableSkeleton rows={6} />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        {["Employee", "Type", "Start Date", "End Date", "Total Days", "Reason", "Status", "Actions"].map((h) => (
                                            <th key={h} className="py-3 px-3 border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeaves.length > 0 ? filteredLeaves.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-3 fw-medium">{r.employee_name}</td>
                                            <td className="px-3">{r.leave_type}</td>
                                            <td className="px-3 text-muted">{r.start_date}</td>
                                            <td className="px-3 text-muted">{r.end_date}</td>
                                            <td className="px-3">{r.total_days} days</td>
                                            <td className="px-3 text-truncate" style={{ maxWidth: "200px" }}>{r.reason}</td>
                                            <td className="px-3">
                                                <span className={`badge bg-${STATUS_BADGE[r.approval_status] ?? "secondary"}`}>{r.approval_status}</span>
                                            </td>
                                            <td className="px-3">
                                                <div className="d-flex gap-2">
                                                    {r.approval_status === "Pending" && (
                                                        <>
                                                            <button className="btn btn-sm text-success p-0" onClick={() => updateStatus(r.id, "Approved")} title="Approve">
                                                                <Check size={18} />
                                                            </button>
                                                            <button className="btn btn-sm text-warning p-0" onClick={() => updateStatus(r.id, "Rejected")} title="Reject">
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="btn btn-sm text-danger p-0 ms-2" onClick={() => setConfirmModal({ isOpen: true, id: r.id })} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5 text-muted">
                                                <Umbrella size={40} style={{ opacity: 0.2 }} className="mb-2" />
                                                <p>No leave records found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ isOpen: false, id: null })} 
                onConfirm={handleDelete} 
                title="Delete Leave Record" 
                message="Are you sure you want to delete this leave record?" 
            />
        </div>
    );
}

export default Leave;
