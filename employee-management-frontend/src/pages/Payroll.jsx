import { useState, useEffect } from "react";
import api from "../services/api";
import { Wallet, Plus, X, Save, Trash2, Printer, Calendar } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton } from "../components/SkeletonLoader";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Payroll() {
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [filterMonth, setFilterMonth] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = today.slice(0, 7); // YYYY-MM

    const [form, setForm] = useState({
        employee: "", month: currentMonth, basic_salary: "", deductions: "0", bonuses: "0", payment_date: today
    });

    const loadData = () => {
        setLoading(true);
        let url = "payrolls/";
        if (filterMonth) url += `?month=${filterMonth}`;
        
        Promise.all([api.get(url), api.get("employees/?page_size=1000")])
            .then(([pay, emp]) => {
                setRecords(pay.data.results ?? pay.data);
                setEmployees(emp.data.results ?? emp.data);
            })
            .catch(() => toast.error("Failed to load payroll data"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, [filterMonth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("payrolls/", form);
            toast.success("Payroll record added successfully!");
            setShowForm(false);
            setForm({ employee: "", month: currentMonth, basic_salary: "", deductions: "0", bonuses: "0", payment_date: today });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to add payroll record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const { id } = confirmModal;
        try {
            await api.delete(`payrolls/${id}/`);
            toast.success("Payroll record deleted");
            loadData();
        } catch {
            toast.error("Failed to delete record");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate chart data from current records
    const chartData = records.slice(0, 10).map(r => ({
        name: r.employee_name.split(' ')[0], // First name only
        net: parseFloat(r.net_salary),
        basic: parseFloat(r.basic_salary)
    }));

    return (
        <div className="animate-fade-in">
            {/* Print Styles */}
            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    #payslip-modal, #payslip-modal * { visibility: visible; }
                    #payslip-modal { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-4 page-header-row">
                <div>
                    <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <Wallet size={28} className="text-success" /> Payroll
                    </h1>
                    <p className="text-muted mb-0">Manage employee salaries and payslips</p>
                </div>
                <div className="page-action-bar">
                    <input type="month" className="form-control filter-date-input" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ width: "160px" }} />
                    {filterMonth && <button className="btn btn-sm btn-outline-secondary" onClick={() => setFilterMonth("")}><X size={14}/></button>}
                    
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowForm(!showForm)}>
                        {showForm ? <><X size={16} />Cancel</> : <><Plus size={16} />Run Payroll</>}
                    </button>
                </div>
            </div>

            {/* Chart (hidden on mobile) */}
            {!loading && records.length > 0 && !showForm && (
                <div className="card mb-4 border-0 d-none d-md-block">
                    <div className="card-body p-4">
                        <h6 className="fw-bold mb-4">Salary Distribution (Current View)</h6>
                        <div style={{ height: "250px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="net" name="Net Salary" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="basic" name="Basic" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="card mb-4 border-success">
                    <div className="card-header border-bottom py-3">
                        <h6 className="mb-0 fw-bold">Add Payroll Record</h6>
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
                                    <label className="form-label text-muted small">Month *</label>
                                    <input type="month" className="form-control" value={form.month} required onChange={(e) => setForm({ ...form, month: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Payment Date *</label>
                                    <input type="date" className="form-control" value={form.payment_date} required onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Basic Salary *</label>
                                    <input type="number" className="form-control" value={form.basic_salary} required onChange={(e) => setForm({ ...form, basic_salary: e.target.value })} />
                                </div>
                                <div className="col-md-1">
                                    <label className="form-label text-muted small">Bonus</label>
                                    <input type="number" className="form-control" value={form.bonuses} onChange={(e) => setForm({ ...form, bonuses: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label text-muted small">Deductions</label>
                                    <input type="number" className="form-control" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
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
            <div className="card border-0">
                <div className="card-body p-0">
                    {loading ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        {["Employee", "Month", "Basic", "Bonus", "Deductions", "Net Salary", "Payment Date", "Actions"].map((h) => (
                                            <th key={h} className="py-3 px-3 border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length > 0 ? records.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-3 fw-medium">{r.employee_name}</td>
                                            <td className="px-3 text-muted">{r.month}</td>
                                            <td className="px-3">₹{r.basic_salary}</td>
                                            <td className="px-3 text-success">+₹{r.bonuses}</td>
                                            <td className="px-3 text-danger">-₹{r.deductions}</td>
                                            <td className="px-3 fw-bold text-primary">₹{r.net_salary}</td>
                                            <td className="px-3 text-muted">{r.payment_date}</td>
                                            <td className="px-3">
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-sm btn-outline-primary p-1 px-2 d-flex align-items-center gap-1" onClick={() => setSelectedPayslip(r)}>
                                                        <Printer size={14} /> Slip
                                                    </button>
                                                    <button className="btn btn-sm text-danger p-0 ms-1" onClick={() => setConfirmModal({ isOpen: true, id: r.id })}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-5 text-muted">
                                                <Wallet size={40} style={{ opacity: 0.2 }} className="mb-2" />
                                                <p>No payroll records found for this period</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Payslip Modal */}
            {selectedPayslip && (
                <>
                    <div className="modal-backdrop show"></div>
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0" id="payslip-modal" style={{ background: "var(--bg-surface)" }}>
                                <div className="modal-header border-bottom border-secondary no-print">
                                    <h5 className="modal-title fw-bold">Payslip</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedPayslip(null)}></button>
                                </div>
                                <div className="modal-body p-5 bg-white text-dark" style={{ borderRadius: "0 0 8px 8px" }}>
                                    <div className="text-center mb-4 pb-4 border-bottom">
                                        <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>EMS Portal</h2>
                                        <p className="text-muted mb-0">Salary Slip for {selectedPayslip.month}</p>
                                    </div>
                                    
                                    <div className="row mb-5">
                                        <div className="col-6">
                                            <p className="mb-1 text-muted small">Employee Name</p>
                                            <h5 className="fw-bold">{selectedPayslip.employee_name}</h5>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="mb-1 text-muted small">Payment Date</p>
                                            <h6 className="fw-bold">{selectedPayslip.payment_date}</h6>
                                        </div>
                                    </div>
                                    
                                    <table className="table table-bordered mb-4">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="text-dark">Earnings</th>
                                                <th className="text-end text-dark">Amount</th>
                                                <th className="text-dark">Deductions</th>
                                                <th className="text-end text-dark">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Basic Salary</td>
                                                <td className="text-end">₹{selectedPayslip.basic_salary}</td>
                                                <td>Tax / Other</td>
                                                <td className="text-end">₹{selectedPayslip.deductions}</td>
                                            </tr>
                                            <tr>
                                                <td>Bonuses</td>
                                                <td className="text-end">₹{selectedPayslip.bonuses}</td>
                                                <td></td>
                                                <td className="text-end"></td>
                                            </tr>
                                            <tr className="fw-bold bg-light">
                                                <td className="text-dark">Total Earnings</td>
                                                <td className="text-end text-dark">₹{((parseFloat(selectedPayslip.basic_salary) || 0) + (parseFloat(selectedPayslip.bonuses) || 0)).toFixed(2)}</td>
                                                <td className="text-dark">Total Deductions</td>
                                                <td className="text-end text-dark">₹{(parseFloat(selectedPayslip.deductions) || 0).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <div className="bg-light p-3 rounded text-end mb-5">
                                        <span className="text-muted me-3">Net Payable:</span>
                                        <span className="fs-3 fw-bold text-dark">₹{selectedPayslip.net_salary}</span>
                                    </div>
                                    
                                    <div className="text-center text-muted small mt-5 pt-3 border-top">
                                        <p>This is a computer generated payslip and does not require a signature.</p>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 no-print">
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedPayslip(null)}>Close</button>
                                    <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
                                        <Printer size={16} /> Print Payslip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ isOpen: false, id: null })} 
                onConfirm={handleDelete} 
                title="Delete Payroll Record" 
                message="Are you sure you want to delete this payroll record?" 
            />
        </div>
    );
}

export default Payroll;
