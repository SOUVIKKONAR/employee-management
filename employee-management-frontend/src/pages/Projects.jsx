import { useState, useEffect } from "react";
import api from "../services/api";
import { Rocket, Plus, X, Save, Trash2, Edit2, LayoutGrid, List } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { TableSkeleton, CardSkeleton } from "../components/SkeletonLoader";
import { toast } from "react-toastify";

const STATUS_COLORS = { "Not Started": "secondary", "In Progress": "primary", "On Hold": "warning", "Completed": "success" };
const PRIORITY_COLORS = { "Low": "info", "Medium": "warning", "High": "danger" };

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
    const [viewMode, setViewMode] = useState("board"); // "board" or "list"

    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({
        project_name: "", description: "", start_date: today, end_date: "", status: "Not Started", priority: "Medium", budget: ""
    });
    const [editId, setEditId] = useState(null);

    const loadData = () => {
        setLoading(true);
        api.get("projects/")
            .then(res => setProjects(res.data.results ?? res.data))
            .catch(() => toast.error("Failed to load projects"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editId) {
                await api.put(`projects/${editId}/`, form);
                toast.success("Project updated!");
            } else {
                await api.post("projects/", form);
                toast.success("Project added!");
            }
            setShowForm(false);
            setEditId(null);
            setForm({ project_name: "", description: "", start_date: today, end_date: "", status: "Not Started", priority: "Medium", budget: "" });
            loadData();
        } catch {
            toast.error("Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (project) => {
        setForm(project);
        setEditId(project.id);
        setShowForm(true);
    };

    const handleDelete = async () => {
        const { id } = confirmModal;
        try {
            await api.delete(`projects/${id}/`);
            toast.success("Project deleted");
            loadData();
        } catch {
            toast.error("Delete failed");
        }
    };

    const groupedProjects = {
        "Not Started": projects.filter(p => p.status === "Not Started"),
        "In Progress": projects.filter(p => p.status === "In Progress"),
        "On Hold": projects.filter(p => p.status === "On Hold"),
        "Completed": projects.filter(p => p.status === "Completed")
    };

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <Rocket size={28} className="text-warning" /> Projects
                    </h1>
                    <p className="text-muted mb-0">Manage company projects and assignments</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="btn-group me-2">
                        <button className={`btn btn-sm ${viewMode === 'board' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('board')}><LayoutGrid size={16}/></button>
                        <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('list')}><List size={16}/></button>
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditId(null);
                            setForm({ project_name: "", description: "", start_date: today, end_date: "", status: "Not Started", priority: "Medium", budget: "" });
                        }
                    }}>
                        {showForm ? <><X size={16} />Cancel</> : <><Plus size={16} />New Project</>}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card mb-4 border-warning">
                    <div className="card-header border-bottom py-3">
                        <h6 className="mb-0 fw-bold">{editId ? "Edit Project" : "New Project"}</h6>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Project Name *</label>
                                    <input type="text" className="form-control" value={form.project_name} required onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">Status</label>
                                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">Priority</label>
                                    <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Start Date *</label>
                                    <input type="date" className="form-control" value={form.start_date} required onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">End Date</label>
                                    <input type="date" className="form-control" value={form.end_date || ""} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Budget (₹)</label>
                                    <input type="number" className="form-control" value={form.budget || ""} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small">Description</label>
                                    <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                                </div>
                                <div className="col-12 mt-4">
                                    <button type="submit" disabled={submitting} className="btn btn-primary px-4 d-flex align-items-center gap-2">
                                        {submitting ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><Save size={16} />{editId ? "Update" : "Save"} Project</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                viewMode === 'list' ? <TableSkeleton rows={5} /> : (
                    <div className="row g-4">
                        {[1, 2, 3, 4].map(i => <div className="col-md-3" key={i}><CardSkeleton /></div>)}
                    </div>
                )
            ) : viewMode === 'list' ? (
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        {["Project Name", "Status", "Priority", "Start Date", "End Date", "Budget", "Actions"].map((h) => (
                                            <th key={h} className="py-3 px-3 border-0">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length > 0 ? projects.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-3 fw-bold">{p.project_name}</td>
                                            <td className="px-3">
                                                <span className={`badge bg-${STATUS_COLORS[p.status]}`}>{p.status}</span>
                                            </td>
                                            <td className="px-3">
                                                <span className={`badge bg-${PRIORITY_COLORS[p.priority]}`}>{p.priority}</span>
                                            </td>
                                            <td className="px-3 text-muted">{p.start_date}</td>
                                            <td className="px-3 text-muted">{p.end_date || "–"}</td>
                                            <td className="px-3">{p.budget ? `₹${p.budget}` : "–"}</td>
                                            <td className="px-3">
                                                <button className="btn btn-sm btn-link text-primary p-0 me-2" onClick={() => handleEdit(p)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn btn-sm btn-link text-danger p-0" onClick={() => setConfirmModal({ isOpen: true, id: p.id })}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                No projects found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row g-4" style={{ overflowX: "auto", flexWrap: "nowrap" }}>
                    {Object.keys(groupedProjects).map(status => (
                        <div className="col-11 col-md-4 col-lg-3 d-flex flex-column gap-3" key={status}>
                            <h6 className="fw-bold d-flex justify-content-between align-items-center text-muted px-2">
                                {status} 
                                <span className="badge bg-secondary rounded-pill">{groupedProjects[status].length}</span>
                            </h6>
                            {groupedProjects[status].map(p => (
                                <div className="card glass-card border-0 shadow-sm" key={p.id}>
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold mb-0 text-white">{p.project_name}</h6>
                                            <span className={`badge bg-${PRIORITY_COLORS[p.priority]} px-2 py-1`} style={{ fontSize: "0.6rem" }}>{p.priority}</span>
                                        </div>
                                        <p className="small text-muted mb-3" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {p.description || "No description provided."}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top" style={{ borderColor: "rgba(255,255,255,0.05) !important" }}>
                                            <div className="small text-muted">
                                                {p.end_date ? new Date(p.end_date).toLocaleDateString() : "Ongoing"}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm text-primary p-0" onClick={() => handleEdit(p)}><Edit2 size={14}/></button>
                                                <button className="btn btn-sm text-danger p-0" onClick={() => setConfirmModal({ isOpen: true, id: p.id })}><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {groupedProjects[status].length === 0 && (
                                <div className="card border-0 shadow-none text-center p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1) !important" }}>
                                    <span className="text-muted small">No projects</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => setConfirmModal({ isOpen: false, id: null })} 
                onConfirm={handleDelete} 
                title="Delete Project" 
                message="Are you sure you want to delete this project?" 
            />
        </div>
    );
}

export default Projects;
