import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import CreatableDropdown from "../../components/CreatableDropdown";
import { toast } from "react-toastify";
import { FilePenLine, Save, MapPin } from "lucide-react";

function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({});
    const [address, setAddress] = useState(null);
    const [addressId, setAddressId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [addrErrors, setAddrErrors] = useState({});
    const [addingDepartment, setAddingDepartment] = useState(false);
    const [addingDesignation, setAddingDesignation] = useState(false);

    const [addrForm, setAddrForm] = useState({
        address_line1: "", address_line2: "", city: "", state: "", country: "India", pincode: "",
    });

    useEffect(() => {
        Promise.all([
            api.get(`employees/${id}/`),
            api.get("departments/?page_size=1000"),
            api.get("designations/?page_size=1000"),
            api.get("employees/?page_size=1000"),
            api.get(`addresses/?employee=${id}`),
        ]).then(([emp, dept, des, allEmp, addr]) => {
            setEmployee(emp.data);
            setDepartments(dept.data.results ?? dept.data);
            setDesignations(des.data.results ?? des.data);
            setEmployees((allEmp.data.results ?? allEmp.data).filter((e) => e.id !== Number(id)));
            const addrData = addr.data.results ?? addr.data;
            const existing = Array.isArray(addrData) ? addrData[0] : addrData;
            if (existing) {
                setAddress(existing);
                setAddressId(existing.id);
                setAddrForm({
                    address_line1: existing.address_line1 ?? "",
                    address_line2: existing.address_line2 ?? "",
                    city: existing.city ?? "",
                    state: existing.state ?? "",
                    country: existing.country ?? "India",
                    pincode: existing.pincode ?? "",
                });
            }
        }).catch(() => toast.error("Failed to load employee data"))
          .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
        setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    };

    const handleAddrChange = (e) => {
        setAddrForm({ ...addrForm, [e.target.name]: e.target.value });
        setAddrErrors({ ...addrErrors, [e.target.name]: null });
    };

    // ─── Add Department inline ───────────────────────────────────────────────
    const handleAddDepartment = async (deptName) => {
        const existing = departments.find(
            (d) => d.dept_name.toLowerCase() === deptName.toLowerCase()
        );
        if (existing) {
            setEmployee((prev) => ({ ...prev, department: String(existing.id) }));
            toast.info("Department already exists — selected it for you.");
            return;
        }
        setAddingDepartment(true);
        try {
            const res = await api.post("departments/", { dept_name: deptName, description: "" });
            setDepartments((prev) => [...prev, res.data]);
            setEmployee((prev) => ({ ...prev, department: String(res.data.id) }));
            setFieldErrors((prev) => ({ ...prev, department: null }));
            toast.success(`Department "${deptName}" created & selected!`);
        } catch (err) {
            const msg = err.response?.data?.dept_name?.[0] || "Failed to add department";
            toast.error(msg);
        } finally {
            setAddingDepartment(false);
        }
    };

    // ─── Add Designation inline ──────────────────────────────────────────────
    const handleAddDesignation = async (desName) => {
        const existing = designations.find(
            (d) => d.designation_name.toLowerCase() === desName.toLowerCase()
        );
        if (existing) {
            setEmployee((prev) => ({ ...prev, designation: String(existing.id) }));
            toast.info("Designation already exists — selected it for you.");
            return;
        }
        setAddingDesignation(true);
        try {
            const res = await api.post("designations/", {
                designation_name: desName,
                grade: "General",
                description: "",
            });
            setDesignations((prev) => [...prev, res.data]);
            setEmployee((prev) => ({ ...prev, designation: String(res.data.id) }));
            setFieldErrors((prev) => ({ ...prev, designation: null }));
            toast.success(`Designation "${desName}" created & selected!`);
        } catch (err) {
            const msg = err.response?.data?.designation_name?.[0] || "Failed to add designation";
            toast.error(msg);
        } finally {
            setAddingDesignation(false);
        }
    };

    // ─── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual validation for dropdowns
        const errors = {};
        if (!employee.department) errors.department = ["Please select or add a department."];
        if (!employee.designation) errors.designation = ["Please select or add a designation."];
        if (Object.keys(errors).length) {
            setFieldErrors((prev) => ({ ...prev, ...errors }));
            toast.error("Please fix the highlighted errors");
            return;
        }

        setSubmitting(true);
        setFieldErrors({});
        setAddrErrors({});
        try {
            await api.put(`employees/${id}/`, {
                ...employee,
                manager: employee.manager || null,
            });

            if (addrForm.address_line1 && addrForm.city) {
                try {
                    if (addressId) {
                        await api.put(`addresses/${addressId}/`, { ...addrForm, employee: Number(id) });
                    } else {
                        await api.post("addresses/", { ...addrForm, employee: Number(id) });
                    }
                } catch (addrErr) {
                    const data = addrErr.response?.data;
                    if (data && typeof data === "object") setAddrErrors(data);
                    toast.warning("Employee updated but address could not be saved.");
                    navigate("/employees");
                    return;
                }
            }

            toast.success("Employee updated successfully!");
            navigate("/employees");
        } catch (error) {
            const data = error.response?.data;
            if (data && typeof data === "object") {
                setFieldErrors(data);
                toast.error("Please fix the highlighted errors");
            } else {
                toast.error("Failed to update employee");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
                    <p className="mt-3 text-muted">Loading employee data…</p>
                </div>
            </div>
        </>
    );

    const ErrMsg = ({ name, errors = fieldErrors }) =>
        errors[name] ? (
            <div className="invalid-feedback d-block">
                {Array.isArray(errors[name]) ? errors[name][0] : errors[name]}
            </div>
        ) : null;

    // Derived option arrays
    const deptOptions = departments.map((d) => ({ value: d.id, label: d.dept_name }));
    const desigOptions = designations.map((d) => ({ value: d.id, label: d.designation_name }));
    const managerOptions = employees.map((e) => ({
        value: e.id,
        label: `${e.first_name} ${e.last_name}`,
    }));

    return (
        <>
            <Navbar />
            <div className="container-fluid py-4 px-4" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                            <div
                                className="card-header border-0 py-4 px-4"
                                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                            >
                                <h3 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
                                    <FilePenLine size={24} /> Edit Employee
                                </h3>
                                <p className="mb-0 text-white" style={{ opacity: 0.85 }}>
                                    {employee.first_name} {employee.last_name} — {employee.emp_code}
                                </p>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit} noValidate>

                                    {/* ── Personal Details ── */}
                                    <h6
                                        className="fw-bold text-muted text-uppercase mb-3"
                                        style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}
                                    >
                                        Personal Details
                                    </h6>
                                    <div className="row">
                                        {[
                                            { label: "Employee Code", name: "emp_code" },
                                            { label: "First Name", name: "first_name" },
                                            { label: "Last Name", name: "last_name" },
                                            { label: "Email", name: "email", type: "email" },
                                            { label: "Phone Number", name: "phone_no" },
                                        ].map(({ label, name, type = "text" }) => (
                                            <div className="col-md-6 mb-3" key={name}>
                                                <label className="form-label fw-semibold text-muted small">
                                                    {label} *
                                                </label>
                                                <input
                                                    type={type}
                                                    name={name}
                                                    className={`form-control ${fieldErrors[name] ? "is-invalid" : ""}`}
                                                    value={employee[name] ?? ""}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderRadius: "10px" }}
                                                />
                                                <ErrMsg name={name} />
                                            </div>
                                        ))}

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Gender *</label>
                                            <select
                                                name="gender"
                                                className="form-select"
                                                value={employee.gender ?? ""}
                                                onChange={handleChange}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Date of Birth *</label>
                                            <input
                                                type="date"
                                                name="dob"
                                                className="form-control"
                                                value={employee.dob ?? ""}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Joining Date *</label>
                                            <input
                                                type="date"
                                                name="joining_date"
                                                className="form-control"
                                                value={employee.joining_date ?? ""}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Salary (₹) *</label>
                                            <input
                                                type="number"
                                                name="salary"
                                                className={`form-control ${fieldErrors.salary ? "is-invalid" : ""}`}
                                                value={employee.salary ?? ""}
                                                onChange={handleChange}
                                                required
                                                style={{ borderRadius: "10px" }}
                                            />
                                            <ErrMsg name="salary" />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Status</label>
                                            <select
                                                name="status"
                                                className="form-select"
                                                value={employee.status ?? "Active"}
                                                onChange={handleChange}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>

                                        {/* ── Department (creatable) ── */}
                                        <div className="col-md-6 mb-3">
                                            <CreatableDropdown
                                                label="Department"
                                                required
                                                options={deptOptions}
                                                value={String(employee.department ?? "")}
                                                onChange={(val) => {
                                                    setEmployee((prev) => ({ ...prev, department: val }));
                                                    setFieldErrors((prev) => ({ ...prev, department: null }));
                                                }}
                                                onAddNew={handleAddDepartment}
                                                placeholder="Select Department"
                                                addPlaceholder="Type department name…"
                                                error={fieldErrors.department}
                                                adding={addingDepartment}
                                            />
                                        </div>

                                        {/* ── Designation (creatable) ── */}
                                        <div className="col-md-6 mb-3">
                                            <CreatableDropdown
                                                label="Designation"
                                                required
                                                options={desigOptions}
                                                value={String(employee.designation ?? "")}
                                                onChange={(val) => {
                                                    setEmployee((prev) => ({ ...prev, designation: val }));
                                                    setFieldErrors((prev) => ({ ...prev, designation: null }));
                                                }}
                                                onAddNew={handleAddDesignation}
                                                placeholder="Select Designation"
                                                addPlaceholder="Type designation name…"
                                                error={fieldErrors.designation}
                                                adding={addingDesignation}
                                            />
                                        </div>

                                        {/* ── Manager ── */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold text-muted small">Manager</label>
                                            <select
                                                name="manager"
                                                className="form-select"
                                                value={employee.manager ?? ""}
                                                onChange={handleChange}
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <option value="">No Manager</option>
                                                {managerOptions.map((m) => (
                                                    <option key={m.value} value={m.value}>{m.label}</option>
                                                ))}
                                            </select>
                                            <div className="mt-1" style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                                                Only existing employees appear here.
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Address ── */}
                                    <hr className="my-4" />
                                    <h6
                                        className="fw-bold text-muted text-uppercase mb-1 d-flex align-items-center gap-1"
                                        style={{ fontSize: "0.78rem", letterSpacing: "0.5px" }}
                                    >
                                        <MapPin size={14} /> Address{" "}
                                        <span className="fw-normal text-lowercase">&nbsp;(optional)</span>
                                    </h6>
                                    <p className="text-muted small mb-3">
                                        Provide at least Address Line 1 and City to save the address.
                                    </p>
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
                                                <input
                                                    type="text"
                                                    name={name}
                                                    className={`form-control ${addrErrors[name] ? "is-invalid" : ""}`}
                                                    value={addrForm[name]}
                                                    onChange={handleAddrChange}
                                                    style={{ borderRadius: "10px" }}
                                                />
                                                {addrErrors[name] && (
                                                    <div className="invalid-feedback">{addrErrors[name]}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="d-flex gap-3 mt-3">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn fw-semibold px-4 py-2 d-flex align-items-center gap-2"
                                            style={{
                                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {submitting ? (
                                                <><span className="spinner-border spinner-border-sm" />Updating…</>
                                            ) : (
                                                <><Save size={16} />Update Employee</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary px-4 py-2"
                                            style={{ borderRadius: "10px" }}
                                            onClick={() => navigate("/employees")}
                                        >
                                            Cancel
                                        </button>
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

export default EditEmployee;