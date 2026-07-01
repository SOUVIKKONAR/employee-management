import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { User, Phone, Mail, Calendar, Building2, Tag, Shield, Banknote, Briefcase, ArrowLeft } from "lucide-react";

function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`employees/${id}/`)
            .then(res => setEmployee(res.data))
            .catch(() => {
                toast.error("Failed to load employee details");
                navigate("/");
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
                    <p className="mt-3 text-muted">Loading employee details...</p>
                </div>
            </div>
        </>
    );

    if (!employee) return null;

    const InfoCard = ({ icon: Icon, label, value }) => (
        <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded" style={{ background: "white", border: "1px solid #e2e8f0" }}>
            <div className="d-flex justify-content-center align-items-center rounded-circle" style={{ width: "40px", height: "40px", background: "#f1f5f9", color: "#64748b" }}>
                <Icon size={20} />
            </div>
            <div>
                <div className="small text-muted fw-semibold">{label}</div>
                <div className="fw-semibold" style={{ color: "#0f172a" }}>{value || "N/A"}</div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="mb-4 d-flex align-items-center gap-3">
                            <button className="btn btn-light shadow-sm" onClick={() => navigate(-1)} style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}>
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="fw-bold mb-0">Employee Profile</h2>
                        </div>
                        
                        <div className="row g-4">
                            {/* Profile Header Card */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                                    <div className="card-body p-5 text-white d-flex flex-column flex-md-row align-items-center gap-4">
                                        <div className="d-flex justify-content-center align-items-center rounded-circle bg-white text-primary fw-bold" style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}>
                                            {employee.first_name[0]}{employee.last_name[0]}
                                        </div>
                                        <div className="text-center text-md-start">
                                            <h2 className="fw-bold mb-1">{employee.first_name} {employee.last_name}</h2>
                                            <p className="mb-2 fs-5" style={{ opacity: 0.9 }}>{employee.designation_name} • {employee.department_name}</p>
                                            <span className={`badge bg-${employee.status === 'Active' ? 'success' : 'secondary'} fs-6 px-3 py-2 rounded-pill shadow-sm`}>
                                                {employee.status}
                                            </span>
                                        </div>
                                        <div className="ms-md-auto mt-4 mt-md-0 d-flex flex-column gap-2">
                                            <Link to={`/edit/${employee.id}`} className="btn btn-light fw-semibold px-4 rounded-pill text-decoration-none">
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><User size={20}/> Personal Information</h5>
                                        <InfoCard icon={Shield} label="Employee Code" value={employee.emp_code} />
                                        <InfoCard icon={Mail} label="Email Address" value={employee.email} />
                                        <InfoCard icon={Phone} label="Phone Number" value={employee.phone_no} />
                                        <InfoCard icon={Calendar} label="Date of Birth" value={employee.dob} />
                                        <InfoCard icon={User} label="Gender" value={employee.gender} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Briefcase size={20}/> Employment Details</h5>
                                        <InfoCard icon={Building2} label="Department" value={employee.department_name} />
                                        <InfoCard icon={Tag} label="Designation" value={employee.designation_name} />
                                        <InfoCard icon={Calendar} label="Joining Date" value={employee.joining_date} />
                                        <InfoCard icon={Banknote} label="Salary" value={`₹${employee.salary}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeDetail;
