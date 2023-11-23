import axios from 'axios';
import '../App.css';
import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo'; 

const MainPage = () => {

    
    const [track, setTrack] = useState({});
  const [transition, setTransition] = useState(null);

  const fetchNewSong = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_new_song');
      setTrack(response.data);
      setTimeout(() => {
        setTransition('fade-in');
    }, 1000);
  } catch (error) {
      console.error("Error fetching song:", error);
  }
  };

  const [likedSongs, setLikedSongs] = useState([]);


  const likeSong = async () => {
    setTransition('like');
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:5000/like_song', track);
        console.log('Song liked successfully');
      } catch (error) {
        console.error('Error liking song:', error);
      }
      try {
        await fetchNewSong();
      } catch (error) {
        console.error("Error fetching song", error);
      }
      fetchLikedSongs();  
    }, 500);
};

  const dislikeSong = async () => {
      setTransition('dislike');
      setTimeout(async () => {
        try {
          await fetchNewSong();
        } catch (error) {
          console.error("Error fetching song", error);
        }
      }, 500);
  };

  const fetchLikedSongs = () => {
    axios.get('http://localhost:5000/get_liked_songs')
    .then(response => {
        setLikedSongs(response.data);
    });
};


  useEffect(() => {
    fetchNewSong();
 }, []);  

 useEffect(() => {
  fetchLikedSongs();
}, []);

const findFavoriteArtist = () => {
    const artistCountMap = {};
    likedSongs.forEach((song) => {
      if (artistCountMap[song.track_artist]) {
        artistCountMap[song.track_artist]++;
      } else {
        artistCountMap[song.track_artist] = 1;
      }
    });
  
    let maxArtist = null;
    let maxCount = 0;
    Object.keys(artistCountMap).forEach((artist) => {
      if (artistCountMap[artist] > maxCount) {
        maxArtist = artist;
        maxCount = artistCountMap[artist];
      }
    });
  
    return (
      <a href={`https://open.spotify.com/search/${maxArtist}`} target="_blank" rel="noopener noreferrer">
        {maxArtist}
      </a>
    );
  };
  
  const favoriteArtist = findFavoriteArtist();


  return (
     <div className="App">
      <UserInfo />
      <header className="App-header">
        <div className={`song-container ${transition}`}>
          <iframe
            style={{ border: 'none' }}
            src={track.embed_url}
            width="300"
            height="380"
            allowtransparency="true"
            title="Spotify"
          ></iframe>
        </div>
        <div>
          <button onClick={dislikeSong}>
            <i className="fas fa-times"></i>
          </button>
          <button onClick={likeSong}>
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </header>
      <div className="sidebar">
      <div className="favorite-artist-section">
          <h2>Favorite Artist</h2>
          <div className="favart">
            {favoriteArtist}
          </div>
        </div>
        <h2>Liked Songs</h2>
        {likedSongs.map((song, index) => (
          <div key={index} className="liked-song">
            {song.track_name}
            <div className="artist-name">{song.track_artist}</div>
          </div>
        ))}
        
      </div>
    </div> 
  );
}

export default MainPage;