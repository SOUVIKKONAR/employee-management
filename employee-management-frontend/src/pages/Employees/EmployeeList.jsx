import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const STATUS_BADGE = {
    Active: "success",
    Inactive: "secondary",
};

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const loadEmployees = useCallback((page = 1, search = searchTerm) => {
        setLoading(true);
        let url = `employees/?page=${page}`;
        if (search.trim() !== "") url += `&search=${encodeURIComponent(search)}`;

        api.get(url)
            .then((response) => {
                setEmployees(response.data.results ?? []);
                setNextPage(response.data.next);
                setPreviousPage(response.data.previous);
                setCurrentPage(page);
                setTotalCount(response.data.count ?? 0);
            })
            .catch(() => toast.error("Failed to load employees"))
            .finally(() => setLoading(false));
    }, [searchTerm]);

    useEffect(() => {
        loadEmployees(1, "");
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await api.delete(`employees/${id}/`);
            toast.success(`"${name}" deleted successfully`);
            loadEmployees(currentPage);
        } catch {
            toast.error("Failed to delete employee");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSearch = () => loadEmployees(1, searchTerm);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>👥 Employees</h1>
                        <p className="text-muted mb-0">
                            {totalCount > 0 ? `${totalCount} employee${totalCount !== 1 ? "s" : ""} found` : "Manage your workforce"}
                        </p>
                    </div>
                    <Link to="/add" className="btn fw-semibold"
                        style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "10px", padding: "10px 22px" }}>
                        ➕ Add Employee
                    </Link>
                </div>

                {/* Search */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "14px" }}>
                    <div className="card-body p-3">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">🔍</span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search by name, code or email — press Enter"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ outline: "none", boxShadow: "none" }}
                            />
                            <button className="btn btn-primary px-4" onClick={handleSearch} style={{ borderRadius: "0 10px 10px 0" }}>
                                Search
                            </button>
                            {searchTerm && (
                                <button className="btn btn-outline-secondary ms-2" style={{ borderRadius: "10px" }}
                                    onClick={() => { setSearchTerm(""); loadEmployees(1, ""); }}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: "14px", overflow: "hidden" }}>
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status" />
                                <p className="mt-3 text-muted">Loading employees...</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "white" }}>
                                        <tr>
                                            {["#", "Code", "Name", "Email", "Phone", "Department", "Designation", "Status", "Joined", "Actions"].map((h) => (
                                                <th key={h} className="py-3 px-3 fw-semibold border-0" style={{ whiteSpace: "nowrap" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.length > 0 ? employees.map((emp, idx) => (
                                            <tr key={emp.id} style={{ transition: "background 0.15s" }}>
                                                <td className="px-3 text-muted">{(currentPage - 1) * 10 + idx + 1}</td>
                                                <td className="px-3"><span className="badge bg-light text-dark border">{emp.emp_code}</span></td>
                                                <td className="px-3 fw-semibold">{emp.first_name} {emp.last_name}</td>
                                                <td className="px-3 text-muted">{emp.email}</td>
                                                <td className="px-3">{emp.phone_no}</td>
                                                <td className="px-3">{emp.department_name ?? "–"}</td>
                                                <td className="px-3">{emp.designation_name ?? "–"}</td>
                                                <td className="px-3">
                                                    <span className={`badge bg-${STATUS_BADGE[emp.status] ?? "secondary"}`}>
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 text-muted" style={{ whiteSpace: "nowrap" }}>{emp.joining_date}</td>
                                                <td className="px-3">
                                                    <div className="d-flex gap-2">
                                                        <Link to={`/edit/${emp.id}`} className="btn btn-sm fw-semibold"
                                                            style={{ background: "#667eea", color: "white", borderRadius: "8px" }}>
                                                            ✏️ Edit
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm fw-semibold"
                                                            style={{ background: "#f5576c", color: "white", borderRadius: "8px" }}
                                                            onClick={() => handleDelete(emp.id, `${emp.first_name} ${emp.last_name}`)}
                                                            disabled={deletingId === emp.id}
                                                        >
                                                            {deletingId === emp.id ? "..." : "🗑️ Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="10" className="text-center py-5 text-muted">
                                                    <div style={{ fontSize: "3rem" }}>🔎</div>
                                                    <p>No employees found</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && (nextPage || previousPage) && (
                        <div className="card-footer bg-white border-top d-flex justify-content-center align-items-center gap-3 py-3">
                            <button className="btn btn-outline-secondary btn-sm px-4" disabled={!previousPage}
                                onClick={() => loadEmployees(currentPage - 1)}>
                                ← Prev
                            </button>
                            <span className="fw-semibold text-muted">Page {currentPage}</span>
                            <button className="btn btn-outline-secondary btn-sm px-4" disabled={!nextPage}
                                onClick={() => loadEmployees(currentPage + 1)}>
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default EmployeeList;