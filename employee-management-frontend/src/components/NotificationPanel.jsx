import { useState, useEffect } from "react";
import api from "../services/api";
import { Bell, X, CheckCheck } from "lucide-react";
import { toast } from "react-toastify";

function NotificationPanel({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    
    useEffect(() => {
        if (isOpen) {
            api.get("notifications/?is_read=false")
                .then(res => setNotifications(res.data.results || res.data))
                .catch(() => {});
        }
    }, [isOpen]);

    const markAsRead = (id) => {
        api.patch(`notifications/${id}/mark_read/`)
            .then(() => setNotifications(notifications.filter(n => n.id !== id)))
            .catch(() => toast.error("Failed to mark read"));
    };
    
    const markAllRead = () => {
        if (notifications.length === 0) return;
        const employeeId = notifications[0].employee; // Assuming notifications belong to logged in user
        api.post(`notifications/mark_all_read/`, { employee_id: employeeId })
            .then(() => setNotifications([]))
            .catch(() => toast.error("Failed to mark all read"));
    };

    return (
        <>
            {isOpen && (
                <div 
                    onClick={onClose}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }}
                />
            )}
            <div style={{
                position: "fixed",
                top: 0,
                right: isOpen ? 0 : "-350px",
                width: "350px",
                height: "100vh",
                background: "var(--bg-surface)",
                borderLeft: "1px solid var(--border)",
                boxShadow: "-4px 0 15px rgba(0,0,0,0.3)",
                transition: "right 0.3s ease",
                zIndex: 1050,
                display: "flex",
                flexDirection: "column"
            }}>
                <div className="p-3 d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid var(--border)" }}>
                    <h6 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <Bell size={18} /> Notifications
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                        {notifications.length > 0 && (
                            <button className="btn btn-sm btn-link text-primary p-0" onClick={markAllRead} style={{ fontSize: "0.8rem", textDecoration: "none" }}>
                                Mark all read
                            </button>
                        )}
                        <button className="btn btn-sm btn-link text-muted p-0" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="p-3 flex-grow-1 overflow-auto">
                    {notifications.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.05)", borderLeft: "3px solid var(--primary)" }}>
                                    <p className="mb-2 small text-white">{n.message}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-1">
                                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                            {new Date(n.created_at).toLocaleString()}
                                        </small>
                                        <button className="btn btn-sm text-primary p-0" onClick={() => markAsRead(n.id)} title="Mark as read">
                                            <CheckCheck size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted mt-5">
                            <Bell size={32} style={{ opacity: 0.2 }} className="mb-2" />
                            <p className="small">No new notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default NotificationPanel;
