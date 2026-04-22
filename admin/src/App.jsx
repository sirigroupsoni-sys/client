import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Menus from './pages/Menus';
import Users from './pages/Users';
import Login from './pages/Login';

// Shared Layout Component
const AdminLayout = ({ children, isCollapsed, setIsCollapsed }) => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <Header />
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

// Placeholder Pages
const Reports = ({ layoutProps }) => <AdminLayout {...layoutProps}><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced Intelligence Reports</h1></AdminLayout>;
const CMS = ({ layoutProps }) => <AdminLayout {...layoutProps}><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Content System</h1></AdminLayout>;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('adminUser');
    if (user) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div className="h-screen flex items-center justify-center bg-[#F8FAFC] font-bold text-slate-300 animate-pulse">Initializing Security Protocols...</div>;
  }

  const layoutProps = { isCollapsed, setIsCollapsed };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <AdminLayout {...layoutProps}><Dashboard /></AdminLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/bookings" 
          element={isAuthenticated ? <AdminLayout {...layoutProps}><Bookings /></AdminLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/menus" 
          element={isAuthenticated ? <AdminLayout {...layoutProps}><Menus /></AdminLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/users" 
          element={isAuthenticated ? <AdminLayout {...layoutProps}><Users /></AdminLayout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/reports" 
          element={isAuthenticated ? <Reports layoutProps={layoutProps} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/cms" 
          element={isAuthenticated ? <CMS layoutProps={layoutProps} /> : <Navigate to="/login" />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
