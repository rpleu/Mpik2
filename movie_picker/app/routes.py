from flask import render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db
from app.models import User, Movie, Rating
from app.utils import calculate_movie_scores
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

@app.route('/')
def index():
    movies = Movie.query.all()
    users = User.query.all() if current_user.is_authenticated else []
    return render_template('index.html', movies=movies, users=users)

# ... [Vos routes login, logout, register restent inchangées] ...
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user is None or not user.check_password(request.form['password']):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user)
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        user = User(username=request.form['username'])
        user.set_password(request.form['password'])
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/add_movie', methods=['POST'])
@login_required
def add_movie():
    data = request.json
    new_movie = Movie(
        title=data['title'],
        description=data.get('description', ''),
        release_date=datetime.strptime(data['release_date'], '%Y-%m-%d').date() if data.get('release_date') else None,
        trailer_url=data.get('trailer_url', '')
    )
    db.session.add(new_movie)
    db.session.commit()
    return jsonify({'success': True, 'id': new_movie.id})

@app.route('/debug_movies')
def debug_movies():
    movies = Movie.query.all()
    return jsonify([{'id': m.id, 'title': m.title} for m in movies])

@app.route('/movie/<int:movie_id>', methods=['GET', 'POST'])
def movie_details(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    if request.method == 'POST':
        movie.title = request.form['title']
        movie.description = request.form['description']
        movie.release_date = datetime.strptime(request.form['release_date'], '%Y-%m-%d').date() if request.form['release_date'] else None
        movie.trailer_url = request.form['trailer_url']
        db.session.commit()
        flash('Les informations du film ont été mises à jour.', 'success')
        return redirect(url_for('movie_details', movie_id=movie.id))
    return render_template('movie_details.html', movie=movie)

@app.route('/rate_movie', methods=['POST'])
@login_required
def rate_movie():
    data = request.json
    existing_rating = Rating.query.filter_by(user_id=current_user.id, movie_id=data['movie_id']).first()
    if existing_rating:
        existing_rating.rating = data['rating']
    else:
        rating = Rating(user_id=current_user.id, movie_id=data['movie_id'], rating=data['rating'])
        db.session.add(rating)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/get_recommendations', methods=['POST'])
@login_required
def get_recommendations():
    data = request.json
    present_users = data['present_users']
    scores = calculate_movie_scores(present_users)
    return jsonify([{'id': movie.id, 'title': movie.title, 'score': score} for movie, score in scores])

@app.route('/get_users')
@login_required
def get_users():
    users = User.query.all()
    return jsonify([{'id': user.id, 'username': user.username} for user in users])

@app.route('/get_movies')
def get_movies():
    movies = Movie.query.all()
    return jsonify([{'id': movie.id, 'title': movie.title} for movie in movies])