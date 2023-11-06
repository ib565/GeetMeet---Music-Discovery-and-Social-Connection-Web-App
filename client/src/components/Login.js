import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';


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
        // Save the logged-in state in localStorage or context
        localStorage.setItem('isLoggedIn', true);
        navigate('/'); // Redirect to the main page
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
      <button onClick={handleGoToSignup}>Signup</button>
    </div>
  );
};

export default Login;
