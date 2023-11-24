import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopMatches.css'

const TopMatches = ({ updateTrigger }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchTopMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_matches', { withCredentials: true });
        setMatches(response.data.top_matches);
      } catch (error) {
        console.error('Error fetching top matches:', error);
      }
    };

    fetchTopMatches();
  }, [updateTrigger]);

  return (
    <div className="top-matches">
      <h2>Top Matches</h2>
      <ul>
        {matches.map((match, index) => (
          <li key={index}>{match[0]} (Score: {match[1].toFixed(2)})</li>
        ))}
      </ul>
    </div>
  );
};

export default TopMatches;
