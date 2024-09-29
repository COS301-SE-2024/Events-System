# ai_service.py
from flask import Flask, request, jsonify
import psycopg2
import pandas as pd
import os
import re
from openai import OpenAI, ChatCompletion
from flask_cors import CORS
import psycopg2
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from datetime import datetime, timedelta, time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client
client = OpenAI(
api_key=os.getenv("OPENAI_API_KEY")
)

def get_db_connection():
    db_url = URL.create(
        drivername="postgresql+psycopg2",
        username=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=5432,
        database="postgres"
    )
    engine = create_engine(db_url)
    return engine

# Define weights for different actions
ACTION_WEIGHTS = {
    'view_event': 0.2, # Default weight for viewed event
    'rsvp_event': 2.0, # Default weight for RSVP'd event
    'viewed_social_club': 0.5, # Default weight for viewed social club
    'submitted_feedback': 3.0,  # Default weight for submitted feedback
    'viewed_profile': 1.5  # Default weight for viewed profile
}

# Filter future events
def filter_future_events(events_df):
    current_time = datetime.now()
    
    # Ensure end_time is a datetime object
    if 'start_date' in events_df.columns:
        events_df['end_time'] = events_df.apply(
            lambda row: datetime.combine(row['start_date'], row['end_time']) if isinstance(row['end_time'], time) else row['end_time'],
            axis=1
        )
    elif 'end_date' in events_df.columns:
        events_df['end_time'] = events_df.apply(
            lambda row: datetime.combine(row['end_date'], row['end_time']) if isinstance(row['end_time'], time) else row['end_time'],
            axis=1
        )
    
    return events_df[events_df['end_time'] > current_time]

# Fetch user analytics data
def fetch_user_analytics():
    engine = get_db_connection()
    query = "SELECT * FROM user_analytics"
    df = pd.read_sql(query, engine)
    return df

# Fetch event data
def fetch_events():
    engine = get_db_connection()
    query = "SELECT * FROM events"
    df = pd.read_sql(query, engine)
    return df

# Fetch social club data
def fetch_social_clubs():
    engine = get_db_connection()
    query = "SELECT * FROM socialclubs"
    df = pd.read_sql(query, engine)
    return df

def fetch_user_rsvps(employee_id):
    conn = get_db_connection()
    query = f"""
    SELECT event_id
    FROM eventrsvps
    WHERE employee_id = {employee_id}
    """
    df = pd.read_sql(query, conn)
    conn.dispose()
    return df['event_id'].tolist()

def get_peak_times():
    conn = get_db_connection()
    query = """
    SELECT e.start_time, e.end_time, COUNT(r.rsvp_id) as popularity
    FROM events e
    JOIN eventrsvps r ON e.event_id = r.event_id
    GROUP BY e.start_time, e.end_time
    ORDER BY popularity DESC
    LIMIT 5;
    """
    df = pd.read_sql(query, conn)
    conn.dispose()
    peak_start_time = df['start_time'].mode()[0]
    peak_end_time = df['end_time'].mode()[0]
    return peak_start_time, peak_end_time

@app.route('/suggest-times', methods=['GET'])
def suggest_times():
    peak_start_time, peak_end_time = get_peak_times()
    return jsonify({
        'peak_start_time': peak_start_time.strftime('%H:%M:%S'),
        'peak_end_time': peak_end_time.strftime('%H:%M:%S')
    })

@app.route('/generate-descriptions', methods=['POST'])
def generate_descriptions():
    event_title = request.args.get('event_title')
    
    if not event_title:
        return jsonify({'error': 'Event title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 3 potential event descriptions that are 2 sentence long for an event titled '{event_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    descriptions = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'descriptions': descriptions})

@app.route('/generate-ss-descriptions', methods=['POST'])
def generate_ss_descriptions():
    social_club_title = request.args.get('social_club_title')
    
    if not social_club_title:
        return jsonify({'error': 'social club title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 3 potential summary social club descriptions that are 1 sentence long for a social club in an events system, the social clubs title is: '{social_club_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    social_summary_descriptions = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'descriptions': social_summary_descriptions})

@app.route('/generate-s-descriptions', methods=['POST'])
def generate_s_descriptions():
    social_club_title = request.args.get('social_club_title')
    
    if not social_club_title:
        return jsonify({'error': 'social club title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 3 potential social club descriptions that are 2 sentence long for a social club in an events system, the social clubs title is: '{social_club_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    social_descriptions = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'descriptions': social_descriptions})

@app.route('/generate-series-descriptions', methods=['POST'])
def generate_se_descriptions():
    series_title = request.args.get('series_title')
    
    if not series_title:
        return jsonify({'error': 'series title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 3 potential series descriptions that are 2 sentence long for a series in an events system, where a series is a collection of events, the series title is: '{series_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    series_descriptions = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'descriptions': series_descriptions})

@app.route('/generate-agenda', methods=['POST'])
def generate_agendas():
    event_title = request.args.get('event_title')
    
    if not event_title:
        return jsonify({'error': 'Event title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 5 summary agenda details that are 3 words or less for an event titled '{event_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    agendas = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'agendas': agendas})

@app.route('/generate-prep', methods=['POST'])
def generate_prep():
    event_title = request.args.get('event_title')
    
    if not event_title:
        return jsonify({'error': 'Event title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 5 preperation details for attendees that are 3 words or less for an event titled '{event_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    prep = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'prep': prep})

@app.route('/generate-tags', methods=['POST'])
def generate_tags():
    event_title = request.args.get('event_title')
    
    if not event_title:
        return jsonify({'error': 'Event title is required'}), 400
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate 5 tags for an event titled '{event_title}':"
            }
        ],
        model="gpt-3.5-turbo",
        max_tokens=150,
        n=1,
        temperature=0.7
    )
    print(response)
    agendas = [choice.message.content.strip() for choice in response.choices]
    
    return jsonify({'tags': agendas})

# Process user actions
def process_user_actions(df, events_df):
    # Ensure all values in 'action_type' column are strings
    df['action_type'] = df['action_type'].astype(str)

    # Define regex patterns to match event IDs, social club IDs, ratings, and viewed profiles
    event_id_pattern = re.compile(r'view_event:\s*(\d+)|rsvp_event:\s*(\d+)')
    social_club_id_pattern = re.compile(r'viewed_social_club:\s*(\d+)')
    rating_pattern = re.compile(r'submitted_feedback:\s*(\d+)\s*:\s*(\d+)')
    profile_pattern = re.compile(r'viewed_profile:\s*(\d+)')

    # Extract event IDs
    df['event_id'] = df['action_type'].apply(lambda x: event_id_pattern.search(x).group(1) if event_id_pattern.search(x) else None)
    df['event_id'] = df['event_id'].astype(float)

    # Extract social club IDs
    df['social_club_id'] = df['action_type'].apply(lambda x: social_club_id_pattern.search(x).group(1) if social_club_id_pattern.search(x) else None)
    df['social_club_id'] = df['social_club_id'].astype(float)

    # Extract ratings
    df['rating'] = df['action_type'].apply(lambda x: rating_pattern.search(x).group(2) if rating_pattern.search(x) else None)
    df['rating'] = df['rating'].astype(float)

    # Extract viewed profiles
    df['viewed_profile'] = df['action_type'].apply(lambda x: profile_pattern.search(x).group(1) if profile_pattern.search(x) else None)
    df['viewed_profile'] = df['viewed_profile'].astype(float)

    # Assign weights based on action type
    df['weight'] = df['action_type'].apply(lambda x: next((weight for action, weight in ACTION_WEIGHTS.items() if action in x), 1.0))

    # Increase weight for events created by viewed profiles if the profile is a host
    for index, row in df.iterrows():
        if pd.notna(row['viewed_profile']):
            host_id = row['viewed_profile']
            hosted_events = events_df[events_df['host_id'] == host_id]['event_id'].tolist()
            if row['event_id'] in hosted_events:
                df.at[index, 'weight'] *= 2  # Double the weight for hosted events

    # Add timestamp column for temporal dynamics
    df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Filter out records older than 14 days
    two_weeks_ago = datetime.now() - timedelta(days=14)
    df = df[df['timestamp'] >= two_weeks_ago]

    return df

# Adjust create_user_profiles function
def create_user_profiles(df):
    user_profiles = df.groupby('user_id').agg({
        'event_id': lambda x: list(x.dropna()),  # Aggregate event IDs into a list
        'social_club_id': lambda x: list(x.dropna()),   # Aggregate social club IDs into a list
        'rating': 'mean',   # Calculate average rating
        'weight': lambda x: list(x),  # Aggregate weights into a list
        'timestamp': 'max'  # Use the most recent timestamp for each user
    }).reset_index()
    return user_profiles

# Calculate Jaccard similarity
def jaccard_similarity(set1, set2):   # Calculate intersection and union of two sets
    intersection = len(set1 & set2)   # Calculate Jaccard similarity
    union = len(set1 | set2)    # Return Jaccard similarity
    return intersection / union if union != 0 else 0    

# Adjust common actions similarity function
def common_actions_similarity(actions1, actions2):  # Calculate the number of common actions
    common_actions = len(actions1 & actions2)       # Calculate the total number of actions
    total_actions = len(actions1 | actions2)        # Return the ratio of common actions to total actions
    return common_actions / total_actions if total_actions != 0 else 0

# Adjust recommend_events_bias function
def recommend_events_bias(user_id, user_profiles, events_df, top_n=5):
    user_profile = user_profiles[user_profiles['user_id'] == user_id]
    if user_profile.empty:
        return []

    user_events = set(user_profile['event_id'].values[0])
    user_actions = set(user_profile['weight'].values[0])
    similar_users = user_profiles[user_profiles['user_id'] != user_id].copy()

    similar_users['jaccard_similarity'] = similar_users.apply(
        lambda row: jaccard_similarity(set(row['event_id']), user_events), axis=1
    )

    user_vector = np.array([1 if event in user_events else 0 for event in events_df['event_id']])
    similar_users['cosine_similarity'] = similar_users.apply(
        lambda row: cosine_similarity([user_vector], [np.array([1 if event in row['event_id'] else 0 for event in events_df['event_id']])])[0][0], axis=1
    )

    similar_users['common_actions_similarity'] = similar_users.apply(
        lambda row: common_actions_similarity(set(row['weight']), user_actions), axis=1
    )

    similar_users['combined_similarity'] = (
        similar_users['jaccard_similarity'] * 0.3 +
        similar_users['cosine_similarity'] * 0.3 +
        similar_users['common_actions_similarity'] * 0.4
    )

    scaler = MinMaxScaler()
    similar_users['normalized_similarity'] = scaler.fit_transform(similar_users[['combined_similarity']])

    current_time = pd.Timestamp.now()
    similar_users['time_decay'] = similar_users['timestamp'].apply(lambda x: np.exp(-0.1 * (current_time - x).days))

    similar_users['final_similarity'] = similar_users['normalized_similarity'] * similar_users['time_decay']

    similar_users = similar_users.sort_values(by='final_similarity', ascending=False)

    recommendations = []
    for _, row in similar_users.iterrows():
        for event_id in row['event_id']:
            if event_id not in user_events and event_id not in recommendations:
                recommendations.append(event_id)
            if len(recommendations) >= top_n:
                break
        if len(recommendations) >= top_n:
            break

    return recommendations

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
    user_event_matrix = df.pivot_table(index='user_id', columns='event_id', aggfunc='size', fill_value=0)
    return user_event_matrix

# Calculate user similarities
def calculate_similarities(user_event_matrix):
    user_similarities = cosine_similarity(user_event_matrix)
    user_similarities_df = pd.DataFrame(user_similarities, index=user_event_matrix.index, columns=user_event_matrix.index)
    return user_similarities_df

# Get most popular events
def get_most_popular_events(df, top_n=5):
    df = filter_future_events(df)
    popular_events = df['event_id'].value_counts().head(top_n).index.tolist()
    return popular_events

# Adjust recommend_events_collaborative function
def recommend_events_collaborative(employee_id, user_event_matrix, user_similarities_df, df, top_n=5, rsvpd_events=[]):
    if employee_id not in user_similarities_df.index:
        return get_most_popular_events(df, top_n=top_n)

    similar_users = user_similarities_df[employee_id].sort_values(ascending=False).index[1:]
    similar_users_events = user_event_matrix.loc[similar_users]
    similar_users_events = similar_users_events[similar_users_events > 0].stack().reset_index()
    similar_users_events.columns = ['employee_id', 'event_id', 'count']

    employee_events = user_event_matrix.loc[employee_id]
    employee_events = employee_events[employee_events > 0].index

    recommendations = similar_users_events[~similar_users_events['event_id'].isin(employee_events)]
    recommendations = recommendations[~recommendations['event_id'].isin(rsvpd_events)]
    recommendations = recommendations.groupby('event_id').sum().sort_values('count', ascending=False).head(top_n)

    return recommendations.index.tolist()

# Get most popular events
def get_most_popular_events(df, top_n=5):
    popular_events = df['event_id'].value_counts().head(top_n).index.tolist()
    return popular_events
# Update unified_recommendation function
def unified_recommendation(employee_id, user_profiles, events_df, user_event_matrix, user_similarities_df, df, top_n=5):
    events_df = filter_future_events(events_df)
    user_profile = user_profiles[user_profiles['user_id'] == employee_id]
    # If user has no actions or is not in user_profiles, return most popular events
    if user_profile.empty or len(user_profile['weight'].values[0]) == 0:
        return get_most_popular_events(df, top_n=top_n)

    rsvpd_events = fetch_user_rsvps(employee_id)
    num_actions = len(user_profile['weight'].values[0])
    if num_actions >= 11:       # If the user has more than 10 actions, use the bias-based recommendation
        print("\033[96mUsing bias-based recommendation\033[0m")
        recommendations = recommend_events_bias(employee_id, user_profiles, events_df, top_n)
    elif num_actions <= 10 and num_actions >= 3:         # If the user has between 3 and 10 actions, use the collaborative filtering-based recommendation
        print("\033[94mUsing collaborative filtering recommendation\033[0m")
        recommendations = recommend_events_collaborative(employee_id, user_event_matrix, user_similarities_df, df, top_n, rsvpd_events)
    elif num_actions <= 3:      # If the user has less than 3 actions, use the most popular events
        print("\033[93mUsing most popular events\033[0m")
        recommendations = get_most_popular_events(df, top_n=top_n)

    final_recommendations = []
    for event_id in recommendations:
        if event_id not in rsvpd_events:
            final_recommendations.append(event_id)
        if len(final_recommendations) >= top_n:
            break

    return final_recommendations


# Flask route for recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify([])

    user_analytics_df = fetch_user_analytics()
    events_df = fetch_events()
    social_clubs_df = fetch_social_clubs()

    user_analytics_df = process_user_actions(user_analytics_df, events_df)
    user_profiles = create_user_profiles(user_analytics_df)
    user_event_matrix = create_user_event_matrix(user_analytics_df)
    user_similarities_df = calculate_similarities(user_event_matrix)

    recommended_event_ids = unified_recommendation(user_id, user_profiles, events_df, user_event_matrix, user_similarities_df, user_analytics_df)

    return jsonify(recommended_event_ids)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)