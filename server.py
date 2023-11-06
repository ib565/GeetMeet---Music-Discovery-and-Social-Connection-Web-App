from flask import Flask, jsonify, request
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import random
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

SPOTIPY_CLIENT_ID = '46b24680194d4e7bbbf2de4e33d7a10f'
SPOTIPY_CLIENT_SECRET = '765794381aa54cea89db65cadaa9f16e'

# Set up Spotify API client
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID,
                                                           client_secret=SPOTIPY_CLIENT_SECRET))

# Database setup

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'  # Define the path to your database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    original_name = db.Column(db.String(120), nullable=False)
    password = db.Column(db.String(120), nullable=False)

class LikedSong(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    track_name = db.Column(db.String(120), nullable=False)
    track_id = db.Column(db.String(120), unique=True, nullable=False)
    track_artist = db.Column(db.String(120), nullable=False)

    user = db.relationship('User', backref=db.backref('liked_songs', lazy=True))

with app.app_context():
    db.create_all()


@app.route('/get_new_song', methods=['GET'])
def get_new_song():
    """Fetches a random track from Spotify based on a keyword search."""
    keyword = "genre:pop"
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

    if user and check_password_hash(user.password, password):
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401
    
@app.route('/signup', methods=['POST'])
def signup():
    username = request.json['username']
    password = request.json['password']

    # Check if user already exists
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password, method='sha256')

    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201


def user_exists(username):
    with open('users.csv', mode='r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['username'] == username:
                return True
    return False



if __name__ == '__main__':
    app.run(debug=True)
    