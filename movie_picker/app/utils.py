from app.models import Rating

def calculate_movie_scores(present_users):
    ratings = Rating.query.filter(Rating.user_id.in_(present_users)).all()
    movie_scores = {}
    for rating in ratings:
        if rating.movie_id not in movie_scores:
            movie_scores[rating.movie_id] = {'total': 0, 'count': 0}
        movie_scores[rating.movie_id]['total'] += rating.rating
        movie_scores[rating.movie_id]['count'] += 1
    
    for movie_id in movie_scores:
        movie_scores[movie_id] = movie_scores[movie_id]['total'] / movie_scores[movie_id]['count']
    
    return sorted(movie_scores.items(), key=lambda x: x[1], reverse=True)