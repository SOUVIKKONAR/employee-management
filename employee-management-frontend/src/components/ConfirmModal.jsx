import { X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDestructive = true }) {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body py-4 text-muted">
                        {message}
                    </div>
                    <div className="modal-footer border-0 pt-0 gap-2">
                        <button type="button" className="btn btn-light fw-semibold" onClick={onClose} style={{ borderRadius: "10px" }}>
                            Cancel
                        </button>
                        <button type="button" className={`btn fw-semibold ${isDestructive ? 'btn-danger' : 'btn-primary'}`} onClick={() => {
                            onConfirm();
                            onClose();
                        }} style={{ borderRadius: "10px" }}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
