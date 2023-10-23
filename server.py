from flask import Flask, jsonify, request
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

SPOTIPY_CLIENT_ID = '46b24680194d4e7bbbf2de4e33d7a10f'
SPOTIPY_CLIENT_SECRET = '765794381aa54cea89db65cadaa9f16e'

# Set up Spotify API client
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID,
                                                           client_secret=SPOTIPY_CLIENT_SECRET))

@app.route('/get_new_song', methods=['GET'])
def get_new_song():
    """Fetches a random track from Spotify based on a keyword search."""
    keyword = "genre:pop"
    results = sp.search(q=keyword, limit=50)
    track = random.choice(results['tracks']['items'])
    track_name = track['name']
    # track_artist = track['artists'][0]['name']
    track_id = track['id']
    embed_url = f"https://open.spotify.com/embed/track/{track_id}"
    # preview_url = track['preview_url']  

    return jsonify({
        "track_name": track_name,
        "track_id": track_id,
        "embed_url": embed_url,
        # 'preview_url': preview_url
    })

liked_songs = []

@app.route('/like_song', methods=['POST'])
def like_song():
    song_data = request.json
    # print(song_data)
    if not any(song['track_id'] == song_data['track_id'] for song in liked_songs):
        liked_songs.append(song_data)
    for song in liked_songs:
        print(song['track_name'])
    return jsonify({'message': 'Song liked!', 'total_likes': len(liked_songs)})


if __name__ == '__main__':
    app.run(debug=True)
    