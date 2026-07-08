import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { UserPlus, Save, MapPin } from "lucide-react";

function AddEmployee() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [addrErrors, setAddrErrors] = useState({});

    const [employee, setEmployee] = useState({
        emp_code: "", first_name: "", last_name: "", email: "",
        phone_no: "", gender: "Male", dob: "", joining_date: "",
        salary: "", status: "Active", department: "", designation: "", manager: "",
    });

    const [address, setAddress] = useState({
        address_line1: "", address_line2: "", city: "", state: "", country: "India", pincode: "",
    });

    useEffect(() => {
        Promise.all([
            api.get("departments/"),
            api.get("designations/"),
            api.get("employees/?page_size=1000"),
        ]).then(([dept, des, emp]) => {
            setDepartments(dept.data.results ?? dept.data);
            setDesignations(des.data.results ?? des.data);
            setEmployees(emp.data.results ?? emp.data);
        }).catch(() => toast.error("Failed to load form data"));
    }, []);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    };

    const handleAddrChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
        setAddrErrors({ ...addrErrors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFieldErrors({});
        setAddrErrors({});
        try {
            const empRes = await api.post("employees/", { ...employee, manager: employee.manager || null });
            const empId = empRes.data.id;
            if (address.address_line1 && address.city) {
                try {
                    await api.post("addresses/", { ...address, employee: empId });
                } catch (addrErr) {
                    const data = addrErr.response?.data;
                    if (data && typeof data === "object") setAddrErrors(data);
                    toast.warning("Employee saved but address could not be saved — please edit to re-enter address.");
                    navigate("/");
                    return;
                }
            }
            toast.success("Employee added successfully!");
            navigate("/");
        } catch (error) {
            const data = error.response?.data;
            if (data && typeof data === "object") {
                setFieldErrors(data);
                toast.error("Please fix the highlighted errors");
            } else {
                toast.error("Failed to add employee");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const ErrMsg = ({ name, errors = fieldErrors }) =>
        errors[name] ? <div className="invalid-feedback d-block">{Array.isArray(errors[name]) ? errors[name][0] : errors[name]}</div> : null;

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                            <div className="card-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
                                <h3 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
                                    <UserPlus size={24} /> Add New Employee
                                </h3>
                                <p className="mb-0 text-white" style={{ opacity: 0.85 }}>Fill in all required fields</p>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>

                                    {/* ── Personal Details ── */}
                                    <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}>Personal Details</h6>
                                    <div className="row">
                                        {[
                                            { label: "Employee Code", name: "emp_code" },
                                            { label: "First Name", name: "first_name" },
                                            { label: "Last Name", name: "last_name" },
                                            { label: "Email", name: "email", type: "email" },
                                            { label: "Phone Number", name: "phone_no" },
                                        ].map(({ label, name, type = "text" }) => (
                                            <div className="col-md-6 mb-3" key={name}>
                                                <label className="form-label fw-semibold text-muted small">{label} *</label>
                                                <input type={type} name={name}
                                                    className={`form-control ${fieldErrors[name] ? "is-invalid" : ""}`}
                                                    value={employee[name]} onChange={handleChange} required
                                                    style={{ borderRadius: "10px" }} />
                                                <ErrMsg name={name} />
                                            </div>
                                        ))}

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Gender *</label>
                                            <select name="gender" className="form-select" value={employee.gender} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Date of Birth *</label>
                                            <input type="date" name="dob" className="form-control" value={employee.dob} onChange={handleChange} required style={{ borderRadius: "10px" }} />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Joining Date *</label>
                                            <input type="date" name="joining_date" className="form-control" value={employee.joining_date} onChange={handleChange} required style={{ borderRadius: "10px" }} />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Salary (₹) *</label>
                                            <input type="number" name="salary" className={`form-control ${fieldErrors.salary ? "is-invalid" : ""}`} value={employee.salary} onChange={handleChange} required style={{ borderRadius: "10px" }} />
                                            <ErrMsg name="salary" />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Status</label>
                                            <select name="status" className="form-select" value={employee.status} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Department *</label>
                                            <select name="department" className={`form-select ${fieldErrors.department ? "is-invalid" : ""}`}
                                                value={employee.department} onChange={handleChange} required style={{ borderRadius: "10px" }}>
                                                <option value="">Select Department</option>
                                                {departments.map((d) => <option key={d.id} value={d.id}>{d.dept_name}</option>)}
                                            </select>
                                            <ErrMsg name="department" />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Designation *</label>
                                            <select name="designation" className={`form-select ${fieldErrors.designation ? "is-invalid" : ""}`}
                                                value={employee.designation} onChange={handleChange} required style={{ borderRadius: "10px" }}>
                                                <option value="">Select Designation</option>
                                                {designations.map((d) => <option key={d.id} value={d.id}>{d.designation_name}</option>)}
                                            </select>
                                            <ErrMsg name="designation" />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Manager</label>
                                            <select name="manager" className="form-select" value={employee.manager} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="">No Manager</option>
                                                {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* ── Address (optional) ── */}
                                    <hr className="my-4" />
                                    <h6 className="fw-bold text-muted text-uppercase mb-1 d-flex align-items-center gap-1" style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}>
                                        <MapPin size={14} /> Address <span className="fw-normal text-lowercase">&nbsp;(optional)</span>
                                    </h6>
                                    <p className="text-muted small mb-3">Provide at least Address Line 1 and City to save the address.</p>
                                    <div className="row">
                                        {[
                                            { label: "Address Line 1", name: "address_line1" },
                                            { label: "Address Line 2", name: "address_line2" },
                                            { label: "City", name: "city" },
                                            { label: "State", name: "state" },
                                            { label: "Country", name: "country" },
                                            { label: "Pincode", name: "pincode" },
                                        ].map(({ label, name }) => (
                                            <div className="col-md-6 mb-3" key={name}>
                                                <label className="form-label fw-semibold text-muted small">{label}</label>
                                                <input type="text" name={name}
                                                    className={`form-control ${addrErrors[name] ? "is-invalid" : ""}`}
                                                    value={address[name]} onChange={handleAddrChange}
                                                    style={{ borderRadius: "10px" }} />
                                                {addrErrors[name] && <div className="invalid-feedback">{addrErrors[name]}</div>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex gap-3 mt-3">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4 py-2 d-flex align-items-center gap-2"
                                            style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm" />Saving...</> : <><Save size={16} />Save Employee</>}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary px-4 py-2" style={{ borderRadius: "10px" }}
                                            onClick={() => navigate("/")}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddEmployee;