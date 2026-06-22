# 🏢 Employee Management System (EMS)

A comprehensive, modern Employee Management System built with **Django REST Framework** (Backend) and **React + Vite** (Frontend). This portal allows organizations to manage their workforce, track attendance, handle leave applications, manage payroll, and assign projects.

---

## ✨ Features

* **👥 Employee Management:** Add, edit, and view employees with advanced filtering and pagination. Tracks department, designation, and manager hierarchy.
* **📅 Attendance Tracking:** Log daily check-in and check-out times, with automatic status badges (Present, Absent, Half-Day).
* **🏖️ Leave Management:** Employees can apply for various types of leave (Casual, Sick, Earned, etc.). Managers can approve or reject applications inline.
* **💰 Payroll System:** Create monthly salary records with automatic net salary calculation (Basic + Bonus - Deductions).
* **🚀 Project Assignments:** Create projects and assign team members. Track project deadlines and member allocations.
* **🔒 Secure Authentication:** JWT-based authentication with automatic token refresh to keep users logged in seamlessly.
* **🎨 Modern UI/UX:** Responsive, glassmorphism-inspired design with smooth micro-animations, built using React, Bootstrap, and Vanilla CSS.

---

## 🛠️ Technology Stack

### Backend
* **Python 3 & Django**
* **Django REST Framework (DRF)** for building the API
* **Simple JWT** for token-based authentication
* **SQLite** (Default database, can be swapped to PostgreSQL/MySQL)
* **django-filter** for API searching and filtering

### Frontend
* **React 18** (via Vite)
* **React Router v6** for protected routing
* **Bootstrap 5** for grid and responsive layouts
* **Axios** for API communication (with request/response interceptors)
* **React Toastify** for elegant toast notifications
* **Vanilla CSS** for custom gradient styling and micro-animations

---

## 🚀 Getting Started

### Prerequisites
* Python 3.8+
* Node.js 18+
* Git

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd employee_management

# Create and activate a virtual environment
python -m venv .venv
source .venv/Scripts/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install python-decouple

# Create a .env file based on environment variables needed
# Example .env content:
# SECRET_KEY=your-secret-key-here
# DEBUG=True

# Apply database migrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```
*The backend API will be running at `http://127.0.0.1:8000/`*

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd employee-management-frontend

# Install Node.js dependencies
npm install

# Run the Vite development server
npm run dev
```
*The frontend application will be running at `http://localhost:5173/`*

---

## 📖 Default Credentials

If you just created a superuser, use those credentials to log in at `http://localhost:5173/login`.

---

## 📁 Project Structure

```text
myproject/
├── employee_management/           # Django Backend
│   ├── employee_management/       # Project Settings & URLs
│   ├── employees/                 # Main App (Models, Views, Serializers)
│   ├── manage.py
│   └── db.sqlite3
│
└── employee-management-frontend/  # React Frontend
    ├── src/
    │   ├── components/            # Reusable UI components (Navbar, etc.)
    │   ├── pages/                 # Full views (Dashboard, Payroll, etc.)
    │   ├── services/              # API and Axios config
    │   ├── App.jsx                # Routing configuration
    │   └── main.jsx               # React Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🌟 Recent Upgrades

* **Performance:** Implemented `select_related` in Django views and added `LargeResultsSetPagination` to handle frontend dropdown scaling efficiently.
* **Resilience:** Implemented a global Axios interceptor to automatically catch `401 Unauthorized` errors and silently refresh the JWT token in the background.
* **Design System:** Replaced native browser alerts with `react-toastify`, integrated the `Inter` font, and implemented modern gradient UI cards across all pages.
