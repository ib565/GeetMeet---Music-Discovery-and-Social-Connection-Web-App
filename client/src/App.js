import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainPage from './components/MainPage';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<MainPage />} /> 
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
          </Routes>
      </Router>
  );
};

export default App;