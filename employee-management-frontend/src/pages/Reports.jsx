import { useState } from "react";
import api from "../services/api";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "react-toastify";

function Reports() {
    const [reportType, setReportType] = useState("attendance");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchReport = () => {
        if (!startDate || !endDate) {
            toast.warning("Please select both start and end dates");
            return;
        }
        
        setLoading(true);
        // This is a simplified fetch - real API would support date range filtering properly
        api.get(`${reportType}/`)
            .then(res => {
                const results = res.data.results || res.data;
                // Client side filtering for demo purposes
                const filtered = results.filter(item => {
                    const dateField = item.att_date || item.start_date || item.payment_date || item.created_at;
                    return dateField >= startDate && dateField <= endDate;
                });
                setData(filtered);
                if (filtered.length === 0) toast.info("No data found for this date range");
            })
            .catch(() => toast.error("Failed to generate report"))
            .finally(() => setLoading(false));
    };

    const handleExport = () => {
        if (data.length === 0) return toast.warning("No data to export");
        
        const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
        const rows = data.map(row => headers.map(h => `"${row[h] || ''}"`));
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${reportType}_report_${startDate}_to_${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <FileText size={28} className="text-info" /> Reports & Analytics
                </h1>
                <p className="text-muted mb-0">Generate and export system reports</p>
            </div>

            <div className="card border-0 mb-4">
                <div className="card-body p-4">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label text-muted small">Report Type</label>
                            <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                <option value="attendance">Attendance Report</option>
                                <option value="leaves">Leave Report</option>
                                <option value="payrolls">Payroll Report</option>
                                <option value="projects">Projects Report</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted small">Start Date</label>
                            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted small">End Date</label>
                            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="col-md-3 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2" onClick={fetchReport} disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm" /> : <><Calendar size={16}/> Generate</>}
                            </button>
                            <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={handleExport} disabled={data.length === 0}>
                                <Download size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {data.length > 0 && (
                <div className="card border-0">
                    <div className="card-header border-bottom py-3 bg-transparent">
                        <h6 className="mb-0 fw-bold text-capitalize">{reportType} Results ({data.length})</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        {Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object').slice(0, 8).map((h) => (
                                            <th key={h} className="py-3 px-3 border-0 text-capitalize">{h.replace(/_/g, ' ')}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, i) => (
                                        <tr key={i}>
                                            {Object.keys(row).filter(k => typeof row[k] !== 'object').slice(0, 8).map(k => (
                                                <td key={k} className="px-3 text-muted">{row[k]?.toString().substring(0, 50)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;
