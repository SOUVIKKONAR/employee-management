import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { CalendarCheck, Plus, X, Save, Trash2, CalendarDays } from "lucide-react";

const STATUS_BADGE = { Present: "success", Absent: "danger", "Half-Day": "warning" };

function Attendance() {
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterDate, setFilterDate] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        employee: "", att_date: today, check_in: "", check_out: "", status: "Present",
    });

    const loadData = () => {
        setLoading(true);
        let url = "attendance/";
        if (filterDate) url += `?att_date=${filterDate}`;
        Promise.all([api.get(url), api.get("employees/?page_size=1000")])
            .then(([att, emp]) => {
                setRecords(att.data.results ?? att.data);
                setEmployees(emp.data.results ?? emp.data);
            })
            .catch(() => toast.error("Failed to load attendance data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, [filterDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.check_out < form.check_in) {
            toast.error("Check-out time cannot be before check-in");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("attendance/", form);
            toast.success("Attendance logged successfully!");
            setShowForm(false);
            setForm({ employee: "", att_date: today, check_in: "", check_out: "", status: "Present" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to log attendance");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this attendance record?")) return;
        try {
            await api.delete(`attendance/${id}/`);
            toast.success("Record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete record");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: "#1a1a2e" }}>
                            <CalendarCheck size={28} /> Attendance
                        </h1>
                        <p className="text-muted mb-0">Track daily check-in / check-out</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                            style={{ borderRadius: "10px", width: "180px" }} />
                        {filterDate && <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: "8px" }} onClick={() => setFilterDate("")}>Clear</button>}
                        <button className="btn fw-semibold d-flex align-items-center gap-2" onClick={() => setShowForm(!showForm)}
                            style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px" }}>
                            {showForm ? <><X size={16} />Cancel</> : <><Plus size={16} />Log Attendance</>}
                        </button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}>
                            <h5 className="mb-0 fw-bold text-white">Log Attendance</h5>
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
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Date *</label>
                                        <input type="date" className="form-control" value={form.att_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, att_date: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Check-In *</label>
                                        <input type="time" className="form-control" value={form.check_in} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Check-Out *</label>
                                        <input type="time" className="form-control" value={form.check_out} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Status *</label>
                                        <select className="form-select" value={form.status} style={{ borderRadius: "10px" }}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Half-Day">Half-Day</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4 d-flex align-items-center gap-2"
                                            style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><Save size={16} />Save Record</>}
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
                                <p className="mt-3 text-muted">Loading...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "white" }}>
                                        <tr>
                                            {["#", "Employee", "Date", "Check-In", "Check-Out", "Status", "Actions"].map((h) => (
                                                <th key={h} className="py-3 px-3 fw-semibold border-0">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.length > 0 ? records.map((r, i) => (
                                            <tr key={r.id}>
                                                <td className="px-3 text-muted">{i + 1}</td>
                                                <td className="px-3 fw-semibold">{r.employee_name}</td>
                                                <td className="px-3">{r.att_date}</td>
                                                <td className="px-3">{r.check_in}</td>
                                                <td className="px-3">{r.check_out}</td>
                                                <td className="px-3">
                                                    <span className={`badge bg-${STATUS_BADGE[r.status] ?? "secondary"}`}>{r.status}</span>
                                                </td>
                                                <td className="px-3">
                                                    <button className="btn btn-sm d-flex align-items-center gap-1" onClick={() => handleDelete(r.id)}
                                                        style={{ background: "#f5576c", color: "white", borderRadius: "8px" }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted">
                                                    <div className="mb-2"><CalendarDays size={40} strokeWidth={1.2} /></div>
                                                    <p>No attendance records found</p>
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

export default Attendance;
