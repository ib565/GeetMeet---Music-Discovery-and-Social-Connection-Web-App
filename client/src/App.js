import axios from 'axios';
import './App.css';
import React, { useState, useEffect } from 'react';
import Login from './components/Login';


function App() {
  const [track, setTrack] = useState({});
  const [transition, setTransition] = useState(null);  // null, 'like', 'dislike'


  const fetchNewSong = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_new_song');
      setTrack(response.data);
      setTimeout(() => {
        setTransition('fade-in');  // Start the fade-in transition after the delay
    }, 1000); // 1 second delay before fade-in starts
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
        // console.log("Received liked songs:", response.data);  
        setLikedSongs(response.data);
    });
};


  useEffect(() => {
    fetchNewSong();
 }, []);  // The empty dependency array ensures it runs once after the initial render.

 useEffect(() => {
  fetchLikedSongs();
}, []);
 
  return (
    <div className="App">
      <header className="App-header">
        <div className={`song-container ${transition}`}>
          <iframe style={{border: 'none'}} src={track.embed_url} width="300" height="380" allowtransparency="true" allow="encrypted-media; autoplay" title="Spotify"></iframe>
        </div>
        <div>
          <button onClick={dislikeSong}><i className="fas fa-times"></i></button>
          <button onClick={likeSong}><i className="fas fa-heart"></i></button>
        </div>
      </header>
  <div className="sidebar">
  <h2>Liked Songs</h2>
  {likedSongs.map((song, index) => (
    <div key={index} className="liked-song">
      {song.track_name}
      <div className="artist-name">
            {song.track_artist}
        </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default App;
