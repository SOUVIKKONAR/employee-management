import { BrowserRouter, Routes, Route } from "react-router-dom";

import EmployeeList from "./pages/Employees/EmployeeList";
import AddEmployee from "./pages/Employees/AddEmployee";
import EditEmployee from "./pages/Employees/EditEmployee";
import EmployeeDetail from "./pages/Employees/EmployeeDetail";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Projects from "./pages/Projects";

import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/add" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
                <Route path="/edit/:id" element={<PrivateRoute><EditEmployee /></PrivateRoute>} />
                <Route path="/employees/:id" element={<PrivateRoute><EmployeeDetail /></PrivateRoute>} />
                <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
                <Route path="/leave" element={<PrivateRoute><Leave /></PrivateRoute>} />
                <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
                <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />

                {/* Fallback */}
                <Route path="*" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;