import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import VerifyEmailPage from './page/VerifyEmailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} /> {/* E-posta onay sayfası */}

      </Routes>
    </Router>
  );
};

export default App;
