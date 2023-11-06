import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const history = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      // Handle password mismatch
      return;
    }
    try {
      const response = await axios.post('/signup', { username, name, password });
      // Handle response, login user, etc.
      history.push('/login'); // Redirect to login page upon successful signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup failure, show error message, etc.
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
