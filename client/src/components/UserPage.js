import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPage.css';

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/user/${userId}`)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [userId]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="user-page">
      <div className="user-details">
        <h1>User Details</h1>
        <p>ID: {userData.user_id}</p>
        <p>Username: {userData.username}</p>
        <p>Name: {userData.name}</p>
        <a href={userData.spotify_link} target="_blank" rel="noopener noreferrer" className="spotify-link">
          Spotify Profile
        </a>
      </div>
      <ul className="liked-songs">
        {userData.liked_songs.map((song, index) => (
          <li key={index} className="liked_song">{song.track_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;
