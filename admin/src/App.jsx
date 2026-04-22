import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layouts/Sidebar';
import Dashboard from './pages/Dashboard';

// Shared Components / Layout
const AdminLayout = ({ children }) => (
  <div className="flex bg-[#F8FAFC] min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-64 p-12 overflow-y-auto">
      {children}
    </main>
  </div>
);

// Placeholder Pages
const Bookings = () => <AdminLayout><h1 className="text-4xl font-black">Bookings</h1></AdminLayout>;
const Menus = () => <AdminLayout><h1 className="text-4xl font-black">Menu Management</h1></AdminLayout>;
const Users = () => <AdminLayout><h1 className="text-4xl font-black">User Management</h1></AdminLayout>;
const Reports = () => <AdminLayout><h1 className="text-4xl font-black">Reports</h1></AdminLayout>;
const CMS = () => <AdminLayout><h1 className="text-4xl font-black">CMS</h1></AdminLayout>;

function App() {
  const isAuthenticated = true; // Temporary for development

  if (!isAuthenticated) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 font-black text-2xl">Login Page Placeholder</div>;
  }

  return (
    <Router basename="/mscaterers/admin">
      <Routes>
        <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/cms" element={<CMS />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
