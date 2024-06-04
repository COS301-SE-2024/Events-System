#!/bin/bash

# Authenticate to Google Cloud
gcloud auth activate-service-account --key-file=Backend/events-system-back-329277c97613.json

# Set your Google Cloud project
gcloud config set project events-system-back

# Deploy the application
gcloud app deploy Backend/app.yml --quiet