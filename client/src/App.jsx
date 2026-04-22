import React, { useState } from 'react';
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
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Bangalore");

  return (
    <AuthProvider>
      <Router basename="/mscaterers/">
        <Preloader onComplete={() => setIsLoading(false)} />

        {!isLoading && (
          <div className="min-h-screen bg-white relative">
            <CityPopup onClose={(city) => city && setSelectedCity(city)} />
            <Header selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
            {!window.location.pathname.includes('/checkprice') && <AlertBar />}
            {!window.location.pathname.includes('/checkprice') && <LocationBar selectedCity={selectedCity} />}

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/package" element={<PackagePage />} />
              <Route path="/checkprice" element={<CheckPricePage />} />
              <Route path="/selectedPackage" element={<SelectedPackagePage />} />
              <Route path="/mscaterersbox" element={<MSCATERERSBoxPage />} />
            </Routes>

            <Footer />
          </div>
        )}
      </Router>
    </AuthProvider>
  )
}

export default App
