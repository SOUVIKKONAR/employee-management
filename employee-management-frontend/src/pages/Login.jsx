import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { Building2, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "", password_confirm: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const loginUser = async () => {
        const response = await api.post("token/", {
            username: credentials.username,
            password: credentials.password,
        });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup && credentials.password !== credentials.password_confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            if (isSignup) {
                await api.post("signup/", credentials);
                await loginUser();
                toast.success("Account created successfully");
            } else {
                await loginUser();
                toast.success("Welcome back!");
            }
            navigate("/dashboard");
        } catch (error) {
            const data = error.response?.data;
            const firstError = data && typeof data === "object"
                ? Object.values(data).flat().join(" ")
                : null;
            toast.error(firstError || (isSignup ? "Failed to create account" : "Invalid username or password"));
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup((current) => !current);
        setShowPassword(false);
        setCredentials({ username: "", password: "", password_confirm: "" });
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px" }}>

                <div className="text-center mb-4">
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, #667eea, #764ba2)", boxShadow: "0 8px 24px rgba(102,126,234,0.4)" }}>
                        <Building2 size={36} color="white" />
                    </div>
                    <h2 className="fw-bold text-white mt-3">EMS Portal</h2>
                    <p style={{ color: "rgba(255,255,255,0.6)" }}>Employee Management System</p>
                </div>

                <div className="card border-0" style={{ borderRadius: "20px", backdropFilter: "blur(10px)", background: "rgba(255,255,255,0.07)", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" }}>
                    <div className="card-body p-4 p-md-5">
                        <h4 className="fw-bold text-white mb-1">{isSignup ? "Sign Up" : "Sign In"}</h4>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }} className="mb-4">
                            {isSignup ? "Create a username and password" : "Enter your credentials to continue"}
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    placeholder="Enter username"
                                    style={{ borderRadius: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control border-end-0"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter password"
                                        style={{ borderRadius: "12px 0 0 12px", padding: "12px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
                                    />
                                    <button type="button" className="input-group-text border-start-0 d-flex align-items-center justify-content-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0 12px 12px 0", color: "white", cursor: "pointer", width: "46px" }}>
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {isSignup && (
                                <div className="mb-4">
                                    <label className="form-label fw-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Confirm Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password_confirm"
                                        className="form-control"
                                        value={credentials.password_confirm}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm password"
                                        style={{ borderRadius: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white" }}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2"
                                style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem" }}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2" />{isSignup ? "Creating account..." : "Signing in..."}</>
                                ) : isSignup ? (
                                    <><UserPlus size={18} />Sign Up</>
                                ) : (
                                    <><LogIn size={18} />Sign In</>
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-4" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
                            {isSignup ? "Already have an account?" : "New to EMS Portal?"}
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="btn btn-link fw-semibold p-0 ms-1 align-baseline"
                                style={{ color: "#93c5fd", textDecoration: "none" }}
                            >
                                {isSignup ? "Sign in" : "Sign up"}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-4" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
                    &copy; {new Date().getFullYear()} Employee Management System
                </p>
            </div>
        </div>
    );
}

export default Login;
