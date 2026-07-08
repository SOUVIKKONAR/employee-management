import { useState, useEffect } from "react";

function StatCard({ label, value, Icon, gradient }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (value === "–" || isNaN(value)) {
            setDisplayValue(value);
            return;
        }
        
        let start = 0;
        const end = parseInt(value, 10);
        if (start === end) {
            setDisplayValue(end);
            return;
        }
        
        const totalDuration = 1000;
        const incrementTime = (totalDuration / end);
        
        const timer = setInterval(() => {
            start += 1;
            setDisplayValue(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);
        
        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="card-body d-flex align-items-center gap-3 p-4" style={{ background: gradient }}>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "12px", display: "flex", backdropFilter: "blur(4px)" }}>
                    <Icon size={28} color="white" />
                </div>
                <div className="text-white">
                    <div className="fs-2 fw-bold" style={{ lineHeight: 1 }}>{displayValue}</div>
                    <div style={{ opacity: 0.9, fontSize: "0.9rem", marginTop: "4px" }}>{label}</div>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
