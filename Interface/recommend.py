import psycopg2
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname='postgres',
        user='Bieber_Fever',
        password='Bieber-Fever1234',
        host='events-system.c7eeu2g6ctsw.us-east-1.rds.amazonaws.com',
        port='5432'
    )
    return conn

# Fetch data
def fetch_data():
    conn = get_db_connection()
    query = """
    SELECT r.employee_id, r.event_id, e.title
    FROM eventrsvps r
    JOIN events e ON r.event_id = e.event_id
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

# Create user-event matrix
def create_user_event_matrix(df):
    user_event_matrix = df.pivot_table(index='employee_id', columns='event_id', aggfunc='size', fill_value=0)
    return user_event_matrix

# Calculate user similarities
def calculate_similarities(user_event_matrix):
    user_similarities = cosine_similarity(user_event_matrix)
    user_similarities_df = pd.DataFrame(user_similarities, index=user_event_matrix.index, columns=user_event_matrix.index)
    return user_similarities_df

# Get most popular events
def get_most_popular_events(df, top_n=5):
    popular_events = df['event_id'].value_counts().head(top_n).index.tolist()
    return popular_events

# Generate recommendations
def recommend_events(employee_id, user_event_matrix, user_similarities_df, df, top_n=3):
    if employee_id not in user_similarities_df.index:
        return get_most_popular_events(df, top_n=5)

    similar_users = user_similarities_df[employee_id].sort_values(ascending=False).index[1:]
    similar_users_events = user_event_matrix.loc[similar_users]
    similar_users_events = similar_users_events[similar_users_events > 0].stack().reset_index()
    similar_users_events.columns = ['employee_id', 'event_id', 'count']
    
    employee_events = user_event_matrix.loc[employee_id]
    employee_events = employee_events[employee_events > 0].index
    
    recommendations = similar_users_events[~similar_users_events['event_id'].isin(employee_events)]
    recommendations = recommendations.groupby('event_id').sum().sort_values('count', ascending=False).head(top_n)
    
    return recommendations.index.tolist()

# Flask route for recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    employee_id = request.args.get('employee_id', type=int)
    if employee_id is None:
        return jsonify({"error": "employee_id is required"}), 400
    
    df = fetch_data()
    user_event_matrix = create_user_event_matrix(df)
    user_similarities_df = calculate_similarities(user_event_matrix)
    recommended_event_ids = recommend_events(employee_id, user_event_matrix, user_similarities_df, df)
    
    return jsonify(recommended_event_ids)

if __name__ == '__main__':
    app.run(debug=True)