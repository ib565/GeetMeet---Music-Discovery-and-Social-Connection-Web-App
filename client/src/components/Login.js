import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
axios.defaults.withCredentials = true;
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      console.log(response.data)
      if (response.data.message === "Login successful") {
        localStorage.setItem('isLoggedIn', true);
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed');
      console.error('An error occurred:', error);
    }
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Log in to गीतMeet</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span className="signup-link" onClick={handleGoToSignup}>Sign up</span></p>
    </div>
  );
};

export default Login;