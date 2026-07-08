export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead style={{ background: "rgba(255,255,255,0.05)" }}>
                    <tr>
                        {[1,2,3,4,5,6].map(i => <th key={i} className="py-3 px-3"><div className="skeleton-box" style={{ height: "16px", width: "80%" }}></div></th>)}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <tr key={i}>
                            {[1,2,3,4,5,6].map(j => <td key={j} className="px-3 py-3"><div className="skeleton-box" style={{ height: "20px", width: "90%" }}></div></td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="card border-0 p-4">
            <div className="skeleton-box mb-3" style={{ height: "24px", width: "40%" }}></div>
            <div className="skeleton-box mb-2" style={{ height: "16px", width: "100%" }}></div>
            <div className="skeleton-box mb-2" style={{ height: "16px", width: "80%" }}></div>
            <div className="skeleton-box" style={{ height: "16px", width: "60%" }}></div>
        </div>
    );
}
