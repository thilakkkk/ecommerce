import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/signup" element={<SignUp theme={theme} />} />
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
}

export default App; 