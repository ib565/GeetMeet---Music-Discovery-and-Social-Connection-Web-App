import axios from 'axios';
import './App.css';
import React, { useState, useEffect } from 'react';


function App() {
  const [track, setTrack] = useState({});
  const [transition, setTransition] = useState(null);  // null, 'like', 'dislike'


  const fetchNewSong = () => {
    axios.get('http://localhost:5000/get_new_song')
    .then(response => {
        setTrack(response.data);
        console.log("Fetched song:", response.data);
      });
  };

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
          const response = await axios.get('http://localhost:5000/get_new_song', track);
          setTrack(response.data);
          setTimeout(() => {
            setTransition('fade-in');  // Start the fade-in transition after the delay
        }, 1000); // 1 second delay before fade-in starts
      } catch (error) {
          console.error("Error fetching song:", error);
      }
    }, 500);
};

  const dislikeSong = async () => {
      setTransition('dislike');
      setTimeout(async () => {
          try {
              const response = await axios.get('http://localhost:5000/get_new_song');
              setTrack(response.data);
              setTimeout(() => {
                setTransition('fade-in');  // Start the fade-in transition after the delay
            }, 1000); // 1 second delay before fade-in starts
          } catch (error) {
              console.error("Error disliking song:", error);
          }
      }, 500);
  };

  useEffect(() => {
    fetchNewSong();
 }, []);  // The empty dependency array ensures it runs once after the initial render.

 
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
    </div>
  );
}

export default App;
