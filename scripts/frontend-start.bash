#!/bin/bash

# Start up the frontend
cd /src || exit
npm nx Events-System:serve &

# Store the process ID (PID) of the server
next_pid=$!

# Wait for the server to start up
while ! curl -s http://localhost:4200 > /dev/null
do
  echo "Waiting for server to start up..."
  sleep 1
done

echo "Server has started."
