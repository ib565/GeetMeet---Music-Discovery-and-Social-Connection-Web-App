import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrendingSongs.css';

const TrendingSongs = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/trending');
        setTrending(response.data);
      } catch (error) {
        console.error('Error fetching trending songs:', error);
      }
    };
    fetchTrendingSongs();
  }, []);

  return (
    <div className="trending-songs">
      <h2>Global Trending Songs</h2>
      <ul>
        {trending.map((song, index) => (
          <li key={index}>{song.title}<br></br><div className="artist_name">{song.artist}</div></li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingSongs;
