from flask import Flask, jsonify, request, session
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import random
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = 'a_long_random_string'
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


SPOTIPY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')

# Set up Spotify API client
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID,
                                                           client_secret=SPOTIPY_CLIENT_SECRET))

# Database setup

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'  # Define the path to your database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)

class LikedSong(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    track_name = db.Column(db.String(120), nullable=False)
    track_id = db.Column(db.String(120), nullable=False)
    track_artist = db.Column(db.String(120), nullable=False)

    user = db.relationship('User', backref=db.backref('liked_songs', lazy=True))

with app.app_context():
    db.create_all()

@app.route('/get_new_song', methods=['GET'])
def get_new_song():
    """Fetches a random track from Spotify based on a keyword search."""
    keyword = "genre:rap"
    results = sp.search(q=keyword, limit=50)
    track = random.choice(results['tracks']['items'])
    track_name = track['name']
    track_artist = track['artists'][0]['name']
    track_id = track['id']
    embed_url = f"https://open.spotify.com/embed/track/{track_id}"

    return jsonify({
        "track_name": track_name,
        "track_id": track_id,
        "embed_url": embed_url,
        "track_artist": track_artist,
    })

liked_songs = []

@app.route('/like_song', methods=['POST'])
def like_song():
    song_data = request.json
    id = session.get('user_id')
    existing_song = LikedSong.query.filter_by(
        user_id=id, 
        track_id=song_data['track_id']
    ).first()
    if existing_song:
        return jsonify({'message': 'Song already liked!'}), 400
    
    new_liked_song = LikedSong(
        user_id=id,
        track_name=song_data['track_name'],
        track_id=song_data['track_id'],
        track_artist=song_data['track_artist']
    )
    db.session.add(new_liked_song)
    db.session.commit()

    if not any(song['track_id'] == song_data['track_id'] for song in liked_songs):
        liked_songs.append(song_data)
    return jsonify({'message': 'Song liked!', 'total_likes': len(liked_songs)})

@app.route('/get_liked_songs', methods=['GET'])
def get_liked_songs():
    return jsonify(liked_songs)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    session['user_id'] = user.id
    session.modified = True
    if user and user.password == password:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    
@app.route('/signup', methods=['POST'])
def signup():
    username = request.json['username']
    name = request.json['name']
    password = request.json['password']
    print(username, name, password)

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409
    
    new_user = User(username=username, name=name, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_info = {
        "user_id": user.id,
        "username": user.username
    }
    return jsonify(user_info)

if __name__ == '__main__':
    app.run(debug=True)    