# Encrypted Live Messaging

This application is a live messaging application with a built in cryptography and key management system to allow for secure messaging. It is part of my submission for CSU33032 Advanced Networks module in TCD.

The application is a simple real-time group messaging app that supports the removal and addition of users to messaging groups.
Message encryption is done using AES-256 for its speed and the AES keys are distributed using RSA-4096 encryption and signing.

The central database stores X.509 certificates for each of the clients and the real-time messaging is supported through websockets, making use of the in-built `WebSocket` class in TypeScript and the [channels](https://pypi.org/project/channels/) library for the server as well as Redis to manage the message queues.

## Setup

The application is fully dockerised though you will need to perform some basic setup before running the docker environments.

```bash
# Make sure node and npm are installed
node --version  # should be v20.*
npm --version  # should be v8.*
npm --prefix client install

# Set up python virtual environment
cd api

# You may need to alias `python` with `python3` here
python --version  # should be 3.11
python -m venv venv
source venv/bin/activate
pip install -r requirements.local.txt

# Change back to root directory
cd ..

# Build the docker containers
make build

# Migrate changes to the database
make migrate
```

## Running the application

To run the application you can run `make run` in the root directory after running the above steps.
Next go to [localhost:4173](http://localhost:4173) in your browser. Voila!

## Demonstration of Pages

Group creation
![Group creation](assets/create-group.png)

View active groups
![View groups](assets/view-groups.png)

Admin view of chat
![Admin view of chat](assets/admin-view.png)

View from an intruder / user not a member of the group
![Trudy view](assets/view-encrypted.png)

View from a user who was not a member but has now been invited
![User view](assets/encrypted-and-decrypted.png)

