import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainPage from './components/MainPage';

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />              {/* Define other routes here */}
          </Routes>
      </Router>
  );
};

export default App;