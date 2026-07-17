import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    User, Phone, Mail, Calendar, Building2, Tag, Shield, Banknote,
    Briefcase, ArrowLeft, MapPin, Rocket, Users, Clock
} from "lucide-react";

function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [address, setAddress] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`employees/${id}/`),
            api.get(`addresses/?employee=${id}`),
            api.get(`employee-projects/?employee=${id}`),
        ])
            .then(([empRes, addrRes, projRes]) => {
                setEmployee(empRes.data);
                const addrData = addrRes.data.results ?? addrRes.data;
                setAddress(Array.isArray(addrData) ? addrData[0] ?? null : addrData);
                setProjects(projRes.data.results ?? projRes.data);
            })
            .catch(() => {
                toast.error("Failed to load employee details");
                navigate("/");
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="text-center">
                <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3 text-muted">Loading employee profile...</p>
            </div>
        </div>
    );

    if (!employee) return null;

    const InfoCard = ({ icon: Icon, label, value, accent }) => (
        <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{ background: "var(--bg-main)", border: "1px solid var(--border)" }}>
            <div className="d-flex justify-content-center align-items-center rounded-circle flex-shrink-0"
                style={{ width: "40px", height: "40px", background: accent ? `${accent}18` : "rgba(255,255,255,0.05)", color: accent ?? "var(--text-secondary)" }}>
                <Icon size={18} />
            </div>
            <div className="overflow-hidden">
                <div className="small text-muted fw-semibold text-uppercase" style={{ letterSpacing: "0.4px", fontSize: "0.72rem" }}>{label}</div>
                <div className="fw-semibold text-truncate" style={{ color: "var(--text-primary)" }}>{value || <span className="text-muted fst-italic">Not provided</span>}</div>
            </div>
        </div>
    );

    const SectionCard = ({ title, icon: Icon, children, color = "#667eea" }) => (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <span className="d-flex align-items-center justify-content-center rounded-2"
                        style={{ width: "32px", height: "32px", background: `${color}18`, color }}>
                        <Icon size={18} />
                    </span>
                    {title}
                </h5>
                {children}
            </div>
        </div>
    );

    const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

    return (
        <div className="animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-xl-11">

                        {/* Back + Page title */}
                        <div className="mb-4 d-flex align-items-center gap-3">
                            <button className="btn btn-white shadow-sm d-flex align-items-center justify-content-center"
                                onClick={() => navigate(-1)}
                                style={{ borderRadius: "50%", width: "42px", height: "42px", padding: 0, background: "white", border: "1px solid #e2e8f0" }}>
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h4 className="fw-bold mb-0">Employee Profile</h4>
                                <p className="text-muted small mb-0">#{employee.emp_code}</p>
                            </div>
                        </div>

                        <div className="row g-4">

                            {/* ── Hero Card ── */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "20px" }}>
                                    <div style={{ height: "8px", background: "linear-gradient(90deg, #667eea, #764ba2, #f5576c)" }} />
                                    <div className="card-body p-4 d-flex flex-column flex-md-row align-items-center gap-4">
                                        {/* Avatar */}
                                        <div className="d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                            style={{
                                                width: "90px", height: "90px", borderRadius: "24px", fontSize: "2rem",
                                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                color: "white", boxShadow: "0 8px 24px rgba(102,126,234,0.4)"
                                            }}>
                                            {initials}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-grow-1 text-center text-md-start">
                                            <h3 className="fw-bold mb-1" style={{ color: "var(--text-primary)" }}>
                                                {employee.first_name} {employee.last_name}
                                            </h3>
                                            <p className="text-muted mb-2 fs-6">
                                                {employee.designation_name} &nbsp;•&nbsp; {employee.department_name}
                                                {employee.manager_name && <> &nbsp;•&nbsp; Reports to <strong>{employee.manager_name}</strong></>}
                                            </p>
                                            <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
                                                <span className={`badge rounded-pill px-3 py-2 bg-${employee.status === "Active" ? "success" : "secondary"}`}>
                                                    {employee.status}
                                                </span>
                                                <span className="badge rounded-pill px-3 py-2 bg-light text-dark border">
                                                    {employee.gender}
                                                </span>
                                                <span className="badge rounded-pill px-3 py-2" style={{ background: "#667eea18", color: "#667eea" }}>
                                                    <Clock size={11} className="me-1" />
                                                    Joined {employee.joining_date}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Action */}
                                        <div className="flex-shrink-0 mt-3 mt-md-0">
                                            <Link to={`/edit/${employee.id}`}
                                                className="btn fw-semibold px-4 py-2 d-flex align-items-center gap-2 text-decoration-none"
                                                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", borderRadius: "12px", border: "none" }}>
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Personal Info ── */}
                            <div className="col-md-6 col-lg-4">
                                <SectionCard title="Personal Info" icon={User} color="#667eea">
                                    <InfoCard icon={Shield} label="Employee Code" value={employee.emp_code} accent="#667eea" />
                                    <InfoCard icon={Mail} label="Email Address" value={employee.email} accent="#4facfe" />
                                    <InfoCard icon={Phone} label="Phone Number" value={employee.phone_no} accent="#43e97b" />
                                    <InfoCard icon={Calendar} label="Date of Birth" value={employee.dob} accent="#f5576c" />
                                    <InfoCard icon={User} label="Gender" value={employee.gender} />
                                </SectionCard>
                            </div>

                            {/* ── Employment Details ── */}
                            <div className="col-md-6 col-lg-4">
                                <SectionCard title="Employment" icon={Briefcase} color="#f5576c">
                                    <InfoCard icon={Building2} label="Department" value={employee.department_name} accent="#f093fb" />
                                    <InfoCard icon={Tag} label="Designation" value={employee.designation_name} accent="#f5576c" />
                                    <InfoCard icon={Calendar} label="Joining Date" value={employee.joining_date} accent="#ffd700" />
                                    <InfoCard icon={Banknote} label="Salary" value={`₹${Number(employee.salary).toLocaleString("en-IN")}`} accent="#43e97b" />
                                    <InfoCard icon={Users} label="Manager" value={employee.manager_name} />
                                </SectionCard>
                            </div>

                            {/* ── Address ── */}
                            <div className="col-md-6 col-lg-4">
                                <SectionCard title="Address" icon={MapPin} color="#4facfe">
                                    {address ? (
                                        <>
                                            <InfoCard icon={MapPin} label="Address Line 1" value={address.address_line1} accent="#4facfe" />
                                            {address.address_line2 && <InfoCard icon={MapPin} label="Address Line 2" value={address.address_line2} />}
                                            <InfoCard icon={MapPin} label="City" value={address.city} />
                                            <InfoCard icon={MapPin} label="State" value={address.state} />
                                            <InfoCard icon={MapPin} label="Country" value={address.country} />
                                            <InfoCard icon={MapPin} label="Pincode" value={address.pincode} />
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <MapPin size={40} strokeWidth={1.2} className="text-muted mb-2" />
                                            <p className="text-muted small">No address on record</p>
                                        </div>
                                    )}
                                </SectionCard>
                            </div>

                            {/* ── Project Assignments ── */}
                            <div className="col-12">
                                <SectionCard title="Project Assignments" icon={Rocket} color="#43e97b">
                                    {projects.length > 0 ? (
                                        <div className="row g-3">
                                            {projects.map((p) => (
                                                <div key={p.id} className="col-md-4 col-lg-3">
                                                    <div className="p-3 rounded-3 d-flex align-items-center gap-2"
                                                        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                                                        <Rocket size={16} style={{ color: "#16a34a", flexShrink: 0 }} />
                                                        <div className="overflow-hidden">
                                                            <div className="fw-semibold text-truncate" style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                                                                {p.project_name}
                                                            </div>
                                                            <div className="text-muted small">Assigned {p.assigned_date}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <Rocket size={40} strokeWidth={1.2} className="text-muted mb-2" />
                                            <p className="text-muted small">Not assigned to any projects</p>
                                        </div>
                                    )}
                                </SectionCard>
                            </div>

                        </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetail;


