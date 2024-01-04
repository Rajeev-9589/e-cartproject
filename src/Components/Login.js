import React, { useState,useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // Use useNavigate hook

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const image = data.image;
        const Name = data.firstName;
        localStorage.setItem('token', token);
        onLogin({token,image,Name});
        navigate('/home');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="border-2 border-green-500 border-dotted h-auto w-96 p-4 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4">Login To Ekart</h1>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col mb-4 items-center">
            <label htmlFor="username" className="mb-1 text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 w-72"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 w-72"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <button
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300" 
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
