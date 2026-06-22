import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

const FIELD_ERRORS_INIT = {};

function AddEmployee() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState(FIELD_ERRORS_INIT);

    const [employee, setEmployee] = useState({
        emp_code: "", first_name: "", last_name: "", email: "",
        phone_no: "", gender: "Male", dob: "", joining_date: "",
        salary: "", status: "Active", department: "", designation: "", manager: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFieldErrors({});
        try {
            await api.post("employees/", { ...employee, manager: employee.manager || null });
            toast.success("Employee added successfully! 🎉");
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

    const Field = ({ label, name, type = "text", required = true, children }) => (
        <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-muted small">{label}{required && " *"}</label>
            {children ?? (
                <input
                    type={type} name={name} className={`form-control ${fieldErrors[name] ? "is-invalid" : ""}`}
                    value={employee[name]} onChange={handleChange} required={required}
                    style={{ borderRadius: "10px" }}
                />
            )}
            {fieldErrors[name] && (
                <div className="invalid-feedback">{Array.isArray(fieldErrors[name]) ? fieldErrors[name][0] : fieldErrors[name]}</div>
            )}
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                            <div className="card-header border-0 py-4 px-4" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
                                <h3 className="mb-0 fw-bold text-white">➕ Add New Employee</h3>
                                <p className="mb-0 text-white" style={{ opacity: 0.85 }}>Fill in all required fields</p>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <Field label="Employee Code" name="emp_code" />
                                        <Field label="First Name" name="first_name" />
                                        <Field label="Last Name" name="last_name" />
                                        <Field label="Email" name="email" type="email" />
                                        <Field label="Phone Number" name="phone_no" />

                                        <Field label="Gender" name="gender">
                                            <select name="gender" className={`form-select ${fieldErrors.gender ? "is-invalid" : ""}`}
                                                value={employee.gender} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </Field>

                                        <Field label="Date of Birth" name="dob" type="date" />
                                        <Field label="Joining Date" name="joining_date" type="date" />
                                        <Field label="Salary (₹)" name="salary" type="number" />

                                        <Field label="Status" name="status">
                                            <select name="status" className="form-select" value={employee.status} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </Field>

                                        <Field label="Department" name="department">
                                            <select name="department" className={`form-select ${fieldErrors.department ? "is-invalid" : ""}`}
                                                value={employee.department} onChange={handleChange} required style={{ borderRadius: "10px" }}>
                                                <option value="">Select Department</option>
                                                {departments.map((d) => <option key={d.id} value={d.id}>{d.dept_name}</option>)}
                                            </select>
                                            {fieldErrors.department && <div className="invalid-feedback">{fieldErrors.department}</div>}
                                        </Field>

                                        <Field label="Designation" name="designation">
                                            <select name="designation" className={`form-select ${fieldErrors.designation ? "is-invalid" : ""}`}
                                                value={employee.designation} onChange={handleChange} required style={{ borderRadius: "10px" }}>
                                                <option value="">Select Designation</option>
                                                {designations.map((d) => <option key={d.id} value={d.id}>{d.designation_name}</option>)}
                                            </select>
                                            {fieldErrors.designation && <div className="invalid-feedback">{fieldErrors.designation}</div>}
                                        </Field>

                                        <Field label="Manager" name="manager" required={false}>
                                            <select name="manager" className="form-select" value={employee.manager} onChange={handleChange} style={{ borderRadius: "10px" }}>
                                                <option value="">No Manager</option>
                                                {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
                                            </select>
                                        </Field>
                                    </div>

                                    <div className="d-flex gap-3 mt-3">
                                        <button type="submit" disabled={submitting} className="btn fw-semibold px-4 py-2"
                                            style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", borderRadius: "10px" }}>
                                            {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : "💾 Save Employee"}
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