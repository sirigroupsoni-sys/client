import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './layouts/Header';
import AlertBar from './layouts/AlertBar';
import LocationBar from './layouts/LocationBar';
import Footer from './layouts/Footer';
import Preloader from './layouts/Preloader';
import CityPopup from './layouts/CityPopup';
import HomePage from './pages/HomePage';
import PackagePage from './pages/PackagePage';
import CheckPricePage from './pages/CheckPricePage';
import SelectedPackagePage from './pages/SelectedPackagePage';
import MSCATERERSBoxPage from './pages/MSCATERERSBoxPage';
import MSCATERERSBuffetPage from './pages/MSCATERERSBuffetPage';
import SnackBoxPage from './pages/SnackBoxPage';
import MealBoxPage from './pages/MealBoxPage';
import ProfilePage from './pages/ProfilePage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import { AuthProvider } from './context/AuthContext';

// Admin Components
import AdminSidebar from './layouts/admin/Sidebar';
import AdminHeader from './layouts/admin/Header';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminMenus from './pages/admin/Menus';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';
import AdminCMS from './pages/admin/CMS';
import AdminLogin from './pages/admin/Login';
import AdminProducts from './pages/admin/Products';

// Shared Admin Layout Component
const AdminLayout = ({ children, isCollapsed, setIsCollapsed }) => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Inter']">
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <AdminHeader />
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('selectedCity') || "Bangalore";
  });
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if admin user is already logged in
    const user = localStorage.getItem('adminUser');
    if (user) {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const isCheckPrice = window.location.pathname.includes('/checkprice');
  const isProfilePath = window.location.pathname.includes('/profile');
  const isAdminPath = window.location.pathname.startsWith('/admin');

  if (checkingAuth && isAdminPath) {
    return <div className="h-screen flex items-center justify-center bg-[#F8FAFC] font-bold text-slate-300 animate-pulse">Establishing Secure Uplink...</div>;
  }

  const layoutProps = { isCollapsed, setIsCollapsed };

  const handleCityChange = (city) => {
    if (city) {
      setSelectedCity(city);
      localStorage.setItem('selectedCity', city);
    }
    setShowCityPopup(false);
  };

  return (
    <AuthProvider>
      <Router>
        <Preloader onComplete={() => setIsLoading(false)} />

        {!isLoading && (
          <div className="min-h-screen bg-white relative">
            {/* Show Client layout only if NOT in Admin path */}
            {!isAdminPath && (
              <CityPopup 
                isOpen={showCityPopup} 
                onClose={handleCityChange} 
              />
            )}
            {!isAdminPath && <Header selectedCity={selectedCity} setSelectedCity={setSelectedCity} />}
            {!isAdminPath && !isCheckPrice && !isProfilePath && <AlertBar />}
            {!isAdminPath && !isCheckPrice && !isProfilePath && (
              <LocationBar 
                selectedCity={selectedCity} 
                onEdit={() => setShowCityPopup(true)} 
              />
            )}

            <Routes>
              {/* --- CLIENT ROUTES --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/package" element={<PackagePage />} />
              <Route path="/checkprice" element={<CheckPricePage />} />
              <Route path="/selectedPackage" element={<SelectedPackagePage />} />
              <Route path="/mscaterersbox" element={<MSCATERERSBoxPage />} />
              <Route path="/mscaterersbuffet" element={<MSCATERERSBuffetPage />} />
              <Route path="/snackbox" element={<SnackBoxPage />} />
              <Route path="/mealbox" element={<MealBoxPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              
              {/* --- ADMIN ROUTES --- */}
              <Route 
                path="/admin/login" 
                element={!isAuthenticated ? <AdminLogin setAuth={setIsAuthenticated} /> : <Navigate to="/admin" />} 
              />
              <Route 
                path="/admin" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminDashboard /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/bookings" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminBookings /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/menus" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminMenus /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/users" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminUsers /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/reports" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminReports /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/cms" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminCMS /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              <Route 
                path="/admin/products" 
                element={isAuthenticated ? <AdminLayout {...layoutProps}><AdminProducts /></AdminLayout> : <Navigate to="/admin/login" />} 
              />
              {/* Catch-all for unknown admin routes */}
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Routes>

            {!isAdminPath && <Footer />}
          </div>
        )}
      </Router>
    </AuthProvider>
  )
}

export default App
