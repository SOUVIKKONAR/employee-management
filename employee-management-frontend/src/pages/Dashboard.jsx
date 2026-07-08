import { useEffect, useState } from "react";
import api from "../services/api";
import { Users, Building2, Tag, Rocket, UserPlus, CalendarCheck, Umbrella, Wallet } from "lucide-react";
import StatCard from "../components/StatCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const quickLinks = [
    { href: "/add", label: "Add Employee", Icon: UserPlus, color: "#3b82f6" },
    { href: "/attendance", label: "Log Attendance", Icon: CalendarCheck, color: "#10b981" },
    { href: "/leave", label: "Manage Leave", Icon: Umbrella, color: "#f59e0b" },
    { href: "/payroll", label: "View Payroll", Icon: Wallet, color: "#8b5cf6" },
];

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceData, setAttendanceData] = useState([]);
    const [payrollData, setPayrollData] = useState([]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get("employees/dashboard_stats/"),
            api.get("attendance/attendance_summary/"),
            api.get("payrolls/payroll_summary/")
        ])
            .then(([statRes, attRes, payRes]) => {
                setStats(statRes.data);
                
                // Format attendance for PieChart
                const attFormatted = attRes.data.map(item => ({
                    name: item.status,
                    value: item.count
                }));
                setAttendanceData(attFormatted.length ? attFormatted : [{name: 'No Data', value: 1}]);
                
                // Format payroll for LineChart
                const payFormatted = payRes.data.map(item => ({
                    month: item.month,
                    total: parseFloat(item.total)
                })).reverse();
                setPayrollData(payFormatted);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        { key: "employees", label: "Total Employees", Icon: Users, gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
        { key: "departments", label: "Departments", Icon: Building2, gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
        { key: "designations", label: "Designations", Icon: Tag, gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
        { key: "projects", label: "Projects", Icon: Rocket, gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
    ];

    return (
        <div className="animate-fade-in">
            <div className="mb-4">
                <h1 className="fw-bold mb-1">Dashboard</h1>
                <p className="text-muted">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="row g-4 mb-4">
                {statCards.map(({ key, label, Icon, gradient }) => (
                    <div className="col-md-6 col-xl-3" key={key}>
                        {loading ? <CardSkeleton /> : (
                            <StatCard 
                                label={label} 
                                value={stats ? stats[key] : "–"} 
                                Icon={Icon} 
                                gradient={gradient} 
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 h-100 p-4">
                        <h6 className="fw-bold mb-4">Payroll Trend (Last 6 Months)</h6>
                        <div style={{ height: "300px" }}>
                            {loading ? <div className="skeleton-box w-100 h-100 rounded"></div> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={payrollData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4">
                    <div className="card border-0 h-100 p-4">
                        <h6 className="fw-bold mb-4">Attendance Overview</h6>
                        <div style={{ height: "300px" }}>
                            {loading ? <div className="skeleton-box w-100 h-100 rounded"></div> : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={attendanceData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {attendanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        {!loading && (
                            <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                {attendanceData.map((entry, index) => (
                                    <div key={entry.name} className="d-flex align-items-center gap-1">
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{entry.name} ({entry.value})</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card border-0">
                <div className="card-body p-4">
                    <h6 className="fw-bold mb-3">Quick Actions</h6>
                    <div className="row g-3">
                        {quickLinks.map(({ href, label, Icon, color }) => (
                            <div className="col-sm-6 col-md-3" key={href}>
                                <a href={href} className="text-decoration-none d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 fw-semibold"
                                    style={{ background: `${color}15`, color, border: `1px solid ${color}30`, transition: "all 0.2s" }}>
                                    <Icon size={17} />
                                    {label}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;