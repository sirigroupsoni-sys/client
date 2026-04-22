import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';

// Simple Redirect component to find the Admin Panel
const AdminRedirect = () => {
  useEffect(() => {
    // Try common dev ports for the admin panel
    const adminPorts = [3001, 5174, 5173];
    const currentPort = window.location.port;
    
    // If we are on port 3000, try to find the admin on 3001
    if (currentPort === "3000") {
      window.location.href = `http://localhost:3001`;
    } else {
      window.location.href = `http://localhost:5174`; // Fallback to common Vite port
    }
  }, []);
  
  return (
    <div className="h-screen flex items-center justify-center bg-white flex-col gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">Establishing Secure Connection to Admin Vault...</p>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Bangalore");

  const isCheckPrice = window.location.pathname.includes('/checkprice');
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <Router>
        <Preloader onComplete={() => setIsLoading(false)} />

        {!isLoading && (
          <div className="min-h-screen bg-white relative">
            {!isAdmin && <CityPopup onClose={(city) => city && setSelectedCity(city)} />}
            {!isAdmin && <Header selectedCity={selectedCity} setSelectedCity={setSelectedCity} />}
            {!isAdmin && !isCheckPrice && <AlertBar />}
            {!isAdmin && !isCheckPrice && <LocationBar selectedCity={selectedCity} />}

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/package" element={<PackagePage />} />
              <Route path="/checkprice" element={<CheckPricePage />} />
              <Route path="/selectedPackage" element={<SelectedPackagePage />} />
              <Route path="/mscaterersbox" element={<MSCATERERSBoxPage />} />
              <Route path="/mscaterersbuffet" element={<MSCATERERSBuffetPage />} />
              <Route path="/snackbox" element={<SnackBoxPage />} />
              <Route path="/mealbox" element={<MealBoxPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Admin Gateway */}
              <Route path="/admin" element={<AdminRedirect />} />
            </Routes>

            {!isAdmin && <Footer />}
          </div>
        )}
      </Router>
    </AuthProvider>
  )
}

export default App
