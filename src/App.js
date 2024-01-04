import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import React, { useState, useEffect } from 'react';
import Login from './Components/Login';

function App() {
  const [imagePath, setImagePath] = useState(null);
  const [Name, setName] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogin = ({ token, image, Name }) => {
    setImagePath(image);
    setName(Name);
    setAuthToken(token);
  };

  const renderHomeOrLogin = () => {
    return authToken ? (
      <Home imagePath={imagePath} Name={Name} />
    ) : (
      <Navigate to="/login" replace />
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={
              loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                React.createElement(renderHomeOrLogin)
              )
            }
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
