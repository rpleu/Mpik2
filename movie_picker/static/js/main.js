// Fonction pour ajouter un film
async function addMovie(event) {
    event.preventDefault();
    const title = document.getElementById('movie-title').value.trim();
    const description = document.getElementById('movie-description').value.trim();
    const releaseDate = document.getElementById('movie-release-date').value;
    const trailerUrl = document.getElementById('movie-trailer').value.trim();

    if (title) {
        try {
            const response = await fetch('/add_movie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, release_date: releaseDate, trailer_url: trailerUrl }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Film ajouté avec succès !');
                await loadMovies();
                document.getElementById('add-movie-form').reset();
            } else {
                alert('Erreur lors de l\'ajout du film.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'ajout du film.');
        }
    }
}

// Fonction pour charger la liste des films
async function loadMovies() {
    try {
        const response = await fetch('/get_movies');
        const movies = await response.json();
        const movieList = document.getElementById('movies');
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/movie/${movie.id}">${movie.title}</a>`;
            
            const ratingInput = document.createElement('input');
            ratingInput.type = 'number';
            ratingInput.min = 1;
            ratingInput.max = 5;
            ratingInput.addEventListener('change', (e) => rateMovie(movie.id, e.target.value));
            
            li.appendChild(ratingInput);
            movieList.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
    }
}

// Fonction pour noter un film
async function rateMovie(movieId, rating) {
    try {
        const response = await fetch('/rate_movie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie_id: movieId, rating }),
        });
        const data = await response.json();
        if (!data.success) {
            alert('Erreur lors de la notation du film');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la notation du film.');
    }
}

// Fonction pour éditer un film
async function editMovie(movieId, formData) {
    try {
        const response = await fetch(`/movie/${movieId}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            alert('Informations du film mises à jour avec succès !');
        } else {
            alert('Erreur lors de la mise à jour des informations du film');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la mise à jour du film.');
    }
}

// Fonction pour obtenir des recommandations
async function getRecommendations() {
    const presentUsers = Array.from(document.getElementById('present-users').selectedOptions).map(option => option.value);
    try {
        const response = await fetch('/get_recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ present_users: presentUsers }),
        });
        const data = await response.json();
        const recommendedMovies = document.getElementById('recommended-movies');
        recommendedMovies.innerHTML = '';
        data.forEach((movie) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/movie/${movie.id}">${movie.title}</a> - Score: ${movie.score.toFixed(2)}`;
            recommendedMovies.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors de l\'obtention des recommandations:', error);
    }
}

// Fonction pour charger les utilisateurs
async function loadUsers() {
    try {
        const response = await fetch('/get_users');
        const users = await response.json();
        const userSelect = document.getElementById('present-users');
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadMovies();
    
    const addMovieForm = document.getElementById('add-movie-form');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', addMovie);
    }

    const recommendButton = document.getElementById('get-recommendations-button');
    if (recommendButton) {
        recommendButton.addEventListener('click', getRecommendations);

    const editMovieForm = document.getElementById('edit-movie-form');
    if (editMovieForm) {
        editMovieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const movieId = editMovieForm.dataset.movieId;
            const formData = new FormData(editMovieForm);
            editMovie(movieId, formData);
    }
});