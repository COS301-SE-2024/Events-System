# ai_service.py
from flask import Flask, request, jsonify
import psycopg2
import pandas as pd
import os
from openai import OpenAI, ChatCompletion
from flask_cors import CORS
import psycopg2
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client
client = OpenAI(
api_key=os.getenv("OPENAI_API_KEY")
)

def get_db_connection():
    conn = psycopg2.connect(
        dbname='postgres',
        user='Bieber_Fever',
        password='Bieber-Fever1234',
        host='events-system.c7eeu2g6ctsw.us-east-1.rds.amazonaws.com',
        port='5432'
    )
    return conn

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
    conn.close()
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

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)