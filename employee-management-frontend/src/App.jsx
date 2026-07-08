import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/Employees/EmployeeList";
import AddEmployee from "./pages/Employees/AddEmployee";
import EditEmployee from "./pages/Employees/EditEmployee";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Projects from "./pages/Projects";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes wrapped in Layout */}
                <Route path="/" element={
                    <PrivateRoute>
                        <Layout>
                            <EmployeeList />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/add" element={
                    <PrivateRoute>
                        <Layout>
                            <AddEmployee />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/edit/:id" element={
                    <PrivateRoute>
                        <Layout>
                            <EditEmployee />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/attendance" element={
                    <PrivateRoute>
                        <Layout>
                            <Attendance />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/leave" element={
                    <PrivateRoute>
                        <Layout>
                            <Leave />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/payroll" element={
                    <PrivateRoute>
                        <Layout>
                            <Payroll />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/projects" element={
                    <PrivateRoute>
                        <Layout>
                            <Projects />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/reports" element={
                    <PrivateRoute>
                        <Layout>
                            <Reports />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="/settings" element={
                    <PrivateRoute>
                        <Layout>
                            <Settings />
                        </Layout>
                    </PrivateRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;