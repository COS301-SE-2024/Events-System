import requests

def fetch_eventbrite_events():
    api_key = 'OXK56A7KS2EWNHJJCYVI'
    url = 'https://www.eventbriteapi.com/v3/events/search/'
    headers = {
        'Authorization': f'Bearer {api_key}',
    }
    params = {
        'q': 'technology',  # Example query
        'location.address': 'San Francisco',
    }
    response = requests.get(url, headers=headers, params=params)
    events = response.json().get('events', [])
    return events

events = fetch_eventbrite_events()
for event in events:
    print(f"Title: {event['name']['text']}")
    print(f"Description: {event['description']['text']}")
    print()