import { useState, useEffect } from "react";
import api from "../services/api";
import { CalendarCheck, Plus, X, Save, Trash2, CalendarDays, Download } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton } from "../components/SkeletonLoader";
import { toast } from "react-toastify";

const STATUS_BADGE = { Present: "success", Absent: "danger", "Half-Day": "warning", Late: "danger" };

function Attendance() {
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterDate, setFilterDate] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

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
        
        // Auto-detect late if after 9:30 AM and currently set to Present
        let finalStatus = form.status;
        if (form.check_in > "09:30" && finalStatus === "Present") {
            finalStatus = "Late";
            toast.info("Auto-marked as Late (Check-in > 09:30 AM)");
        }
        
        setSubmitting(true);
        try {
            await api.post("attendance/", { ...form, status: finalStatus });
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

    const handleDelete = async () => {
        const { id } = confirmModal;
        try {
            await api.delete(`attendance/${id}/`);
            toast.success("Record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete record");
        }
    };
    
    const calculateHours = (inTime, outTime) => {
        if (!inTime || !outTime) return "–";
        const [h1, m1] = inTime.split(":");
        const [h2, m2] = outTime.split(":");
        const minutes = (h2 * 60 + Number(m2)) - (h1 * 60 + Number(m1));
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    const exportCSV = () => {
        if (records.length === 0) return toast.warning("No records to export");
        const headers = ["Employee", "Date", "Check-In", "Check-Out", "Work Hours", "Status"];
        const rows = records.map(r => [
            r.employee_name, r.att_date, r.check_in, r.check_out, calculateHours(r.check_in, r.check_out), r.status
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_export_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 page-header-row">
                <div>
                    <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <CalendarCheck size={28} className="text-primary" /> Attendance
                    </h1>
                    <p className="text-muted mb-0">Track daily check-in / check-out</p>
                </div>
                <div className="page-action-bar">
                    <input type="date" className="form-control filter-date-input" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                        style={{ width: "160px" }} />
                    {filterDate && <button className="btn btn-sm btn-outline-secondary" onClick={() => setFilterDate("")}><X size={14}/></button>}
                    
                    <button className="btn btn-secondary d-flex align-items-center gap-2" onClick={exportCSV}>
                        <Download size={16} /> Export
                    </button>
                    
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowForm(!showForm)}>
                        {showForm ? <><X size={16} />Cancel</> : <><Plus size={16} />Log Attendance</>}
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card mb-4 border-primary">
                    <div className="card-header border-bottom py-3">
                        <h6 className="mb-0 fw-bold">Log Attendance</h6>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">Employee *</label>
                                    <select className="form-select" value={form.employee} required onChange={(e) => setForm({ ...form, employee: e.target.value })}>
                                        <option value="">Select Employee</option>
                                        {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Date *</label>
                                    <input type="date" className="form-control" value={form.att_date} required onChange={(e) => setForm({ ...form, att_date: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Check-In *</label>
                                    <input type="time" className="form-control" value={form.check_in} required onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Check-Out *</label>
                                    <input type="time" className="form-control" value={form.check_out} required onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">Status *</label>
                                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Half-Day">Half-Day</option>
                                        <option value="Late">Late</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-4">
                                    <button type="submit" disabled={submitting} className="btn btn-primary px-4 d-flex align-items-center gap-2">
                                        {submitting ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><Save size={16} />Save Record</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card">
                <div className="card-body p-0">
                    {loading ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        {["Employee", "Date", "Check-In", "Check-Out", "Work Hours", "Status", "Actions"].map((h) => (
                                            <th key={h} className="py-3 px-3 border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length > 0 ? records.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-3 fw-medium">{r.employee_name}</td>
                                            <td className="px-3 text-muted">{r.att_date}</td>
                                            <td className="px-3" style={{ color: r.check_in > "09:30:00" ? "var(--danger)" : "inherit" }}>
                                                {r.check_in}
                                            </td>
                                            <td className="px-3">{r.check_out}</td>
                                            <td className="px-3 fw-medium text-muted">
                                                {calculateHours(r.check_in, r.check_out)}
                                            </td>
                                            <td className="px-3">
                                                <span className={`badge bg-${STATUS_BADGE[r.status] ?? "secondary"}`}>{r.status}</span>
                                            </td>
                                            <td className="px-3">
                                                <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setConfirmModal({ isOpen: true, id: r.id })}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                <CalendarDays size={40} style={{ opacity: 0.2 }} className="mb-2" />
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

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ isOpen: false, id: null })} 
                onConfirm={handleDelete} 
                title="Delete Attendance Record" 
                message="Are you sure you want to delete this attendance record? This action cannot be undone." 
            />
        </div>
    );
}

export default Attendance;
