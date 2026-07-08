import { useState } from "react";
import { Settings as SettingsIcon, Save, Moon, Sun, Monitor, Bell, Shield, Key } from "lucide-react";
import { toast } from "react-toastify";

function Settings() {
    const [theme, setTheme] = useState("system");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        digest: false
    });

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h1 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <SettingsIcon size={28} className="text-secondary" /> Settings
                </h1>
                <p className="text-muted mb-0">Manage system preferences and configurations</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 mb-4">
                        <div className="card-header border-bottom py-3 bg-transparent">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <Monitor size={18} /> Appearance
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className={`p-3 rounded text-center cursor-pointer border ${theme === 'light' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`} onClick={() => setTheme('light')} style={{ cursor: "pointer" }}>
                                        <Sun size={24} className="mb-2" />
                                        <div className="fw-bold">Light</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className={`p-3 rounded text-center cursor-pointer border ${theme === 'dark' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`} onClick={() => setTheme('dark')} style={{ cursor: "pointer" }}>
                                        <Moon size={24} className="mb-2" />
                                        <div className="fw-bold">Dark</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className={`p-3 rounded text-center cursor-pointer border ${theme === 'system' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`} onClick={() => setTheme('system')} style={{ cursor: "pointer" }}>
                                        <Monitor size={24} className="mb-2" />
                                        <div className="fw-bold">System</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 mb-4">
                        <div className="card-header border-bottom py-3 bg-transparent">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <Bell size={18} /> Notifications
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="fw-bold">Email Notifications</div>
                                    <div className="small text-muted">Receive email updates when leaves are approved</div>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} style={{width: "40px", height: "20px"}}/>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <div className="fw-bold">Push Notifications</div>
                                    <div className="small text-muted">In-app popups and alerts</div>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} style={{width: "40px", height: "20px"}}/>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-bold">Weekly Digest</div>
                                    <div className="small text-muted">Summary of attendance and hours</div>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" checked={notifications.digest} onChange={(e) => setNotifications({...notifications, digest: e.target.checked})} style={{width: "40px", height: "20px"}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2" onClick={handleSave}>
                        <Save size={18} /> Save Settings
                    </button>
                </div>
                
                <div className="col-lg-4">
                    <div className="card border-0">
                        <div className="card-header border-bottom py-3 bg-transparent">
                            <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                <Shield size={18} /> Security
                            </h6>
                        </div>
                        <div className="card-body p-4">
                            <button className="btn btn-outline-secondary w-100 mb-3 d-flex align-items-center justify-content-center gap-2">
                                <Key size={16} /> Change Password
                            </button>
                            <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                                <Shield size={16} /> Two-Factor Authentication
                            </button>
                            <div className="mt-4 pt-3 border-top text-center text-muted small">
                                EMS Version 2.0.0<br/>
                                Last updated: Today
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
