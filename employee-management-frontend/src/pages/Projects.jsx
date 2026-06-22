import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeProject, setActiveProject] = useState(null);

    const [projectForm, setProjectForm] = useState({
        project_name: "", description: "", start_date: "", end_date: "",
    });

    const [assignForm, setAssignForm] = useState({ employee: "", project: "" });

    const loadData = () => {
        setLoading(true);
        Promise.all([
            api.get("projects/"),
            api.get("employees/?page_size=1000"),
            api.get("employee-projects/"),
        ]).then(([proj, emp, assign]) => {
            setProjects(proj.data.results ?? proj.data);
            setEmployees(emp.data.results ?? emp.data);
            setAssignments(assign.data.results ?? assign.data);
        }).catch(() => toast.error("Failed to load project data"))
          .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (projectForm.end_date < projectForm.start_date) {
            toast.error("End date cannot be before start date");
            return;
        }
        setSubmitting(true);
        try {
            await api.post("projects/", projectForm);
            toast.success("Project created! 🚀");
            setShowProjectForm(false);
            setProjectForm({ project_name: "", description: "", start_date: "", end_date: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to create project");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("employee-projects/", assignForm);
            toast.success("Employee assigned to project! ✅");
            setShowAssignForm(false);
            setAssignForm({ employee: "", project: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.detail ?? "Failed to assign employee");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Delete this project? All assignments will also be removed.")) return;
        try {
            await api.delete(`projects/${id}/`);
            toast.success("Project deleted");
            loadData();
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const handleRemoveAssignment = async (id) => {
        try {
            await api.delete(`employee-projects/${id}/`);
            toast.success("Assignment removed");
            loadData();
        } catch {
            toast.error("Failed to remove assignment");
        }
    };

    const getProjectAssignments = (projectId) =>
        assignments.filter((a) => a.project === projectId);

    const getDaysRemaining = (endDate) => {
        const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-0" style={{ color: "#1a1a2e" }}>🚀 Projects</h1>
                        <p className="text-muted mb-0">Manage projects and team assignments</p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <button className="btn fw-semibold" onClick={() => { setShowAssignForm(!showAssignForm); setShowProjectForm(false); }}
                            style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px" }}>
                            {showAssignForm ? "✕ Cancel" : "👤 Assign Employee"}
                        </button>
                        <button className="btn fw-semibold" onClick={() => { setShowProjectForm(!showProjectForm); setShowAssignForm(false); }}
                            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px" }}>
                            {showProjectForm ? "✕ Cancel" : "➕ New Project"}
                        </button>
                    </div>
                </div>

                {/* New Project Form */}
                {showProjectForm && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
                            <h5 className="mb-0 fw-bold text-white">New Project</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleProjectSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-muted small">Project Name *</label>
                                        <input type="text" className="form-control" value={projectForm.project_name} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setProjectForm({ ...projectForm, project_name: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">Start Date *</label>
                                        <input type="date" className="form-control" value={projectForm.start_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold text-muted small">End Date *</label>
                                        <input type="date" className="form-control" value={projectForm.end_date} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-muted small">Description *</label>
                                        <input type="text" className="form-control" value={projectForm.description} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4"
                                            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : "🚀 Create Project"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign Form */}
                {showAssignForm && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <div className="card-header border-0 py-3 px-4" style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}>
                            <h5 className="mb-0 fw-bold text-white">Assign Employee to Project</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleAssignSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-5">
                                        <label className="form-label fw-semibold text-muted small">Employee *</label>
                                        <select className="form-select" value={assignForm.employee} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setAssignForm({ ...assignForm, employee: e.target.value })}>
                                            <option value="">Select Employee</option>
                                            {employees.map((e) => (
                                                <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label fw-semibold text-muted small">Project *</label>
                                        <select className="form-select" value={assignForm.project} required style={{ borderRadius: "10px" }}
                                            onChange={(e) => setAssignForm({ ...assignForm, project: e.target.value })}>
                                            <option value="">Select Project</option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.id}>{p.project_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold w-100"
                                            style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <span className="spinner-border spinner-border-sm" /> : "Assign"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                        <p className="mt-3 text-muted">Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <div style={{ fontSize: "3rem" }}>🚀</div>
                        <p>No projects yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {projects.map((proj) => {
                            const daysLeft = getDaysRemaining(proj.end_date);
                            const projAssignments = getProjectAssignments(proj.id);
                            const isExpanded = activeProject === proj.id;

                            return (
                                <div className="col-md-6 col-xl-4" key={proj.id}>
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden", transition: "transform 0.2s", cursor: "pointer" }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                                        <div className="card-header border-0 py-3 px-4"
                                            style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1 fw-bold text-white">{proj.project_name}</h6>
                                                    <small className="text-white" style={{ opacity: 0.8 }}>
                                                        {proj.start_date} → {proj.end_date}
                                                    </small>
                                                </div>
                                                <span className={`badge ${daysLeft < 0 ? "bg-danger" : daysLeft <= 7 ? "bg-warning text-dark" : "bg-light text-dark"}`}>
                                                    {daysLeft < 0 ? "Overdue" : `${daysLeft}d left`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="card-body p-4">
                                            <p className="text-muted small mb-3">{proj.description}</p>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="fw-semibold text-muted small">
                                                    👥 {projAssignments.length} member{projAssignments.length !== 1 ? "s" : ""}
                                                </span>
                                                <button className="btn btn-sm text-muted" style={{ borderRadius: "8px", fontSize: "0.8rem" }}
                                                    onClick={() => setActiveProject(isExpanded ? null : proj.id)}>
                                                    {isExpanded ? "▲ Hide" : "▼ Show Team"}
                                                </button>
                                            </div>

                                            {isExpanded && (
                                                <div className="mb-3">
                                                    {projAssignments.length > 0 ? (
                                                        <ul className="list-unstyled mb-0">
                                                            {projAssignments.map((a) => (
                                                                <li key={a.id} className="d-flex justify-content-between align-items-center py-1 px-2 rounded-2 mb-1"
                                                                    style={{ background: "#f8f9fa" }}>
                                                                    <span className="small">👤 {a.employee_name}</span>
                                                                    <button className="btn btn-sm p-0 px-1 text-danger" title="Remove"
                                                                        onClick={() => handleRemoveAssignment(a.id)}>✕</button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-muted small mb-0">No team members assigned</p>
                                                    )}
                                                </div>
                                            )}

                                            <button className="btn btn-sm w-100"
                                                onClick={() => handleDeleteProject(proj.id)}
                                                style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "8px" }}>
                                                🗑️ Delete Project
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default Projects;
