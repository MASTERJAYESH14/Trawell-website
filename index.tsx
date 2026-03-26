import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './app/page';
import FlightsPage from './app/flights/page';
import AboutUsPage from './app/aboutus/page';
import TermsOfServicePage from './app/termsofservice/page';
import PrivacyPolicyPage from './app/privacypolicy/page';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/termsofservice" element={<TermsOfServicePage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);