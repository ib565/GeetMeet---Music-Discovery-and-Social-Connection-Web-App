import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainPage from './components/MainPage';
import UserPage from './components/UserPage';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<MainPage />} /> 
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/user/:userId" element={<UserPage/>} />
          </Routes>
      </Router>
  );
};

export default App;