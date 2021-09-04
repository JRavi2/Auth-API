# Auth API

This is a simple authentication REST API.

## How to Run

Make sure a local mongodb server is running at Port 27017.

Clone this repository and while in the root directory run the following commands:

    $ npm install
    $ npm run dev

## Endpoints

- POST `/register`:

Endpoint to register a new user. Send a json body with name, email, and password.
Example curl: 
```bash
curl --location --request POST 'localhost:8000/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Ravi",
    "email": "abc@xyz.com",
    "password": "testpass"
}'
```

- POST `/login`:

Endpoint to login by creating a session.

Example curl:
```bash
curl --location --request POST 'localhost:8000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "abc@xyz.com",
    "password": "testpass"
}'
```

- POST `/logout`:

Endpoint to logout from the current session. 
Pass the Bearer token recieved from `/register` or `/login` endpoints.

Example curl:
```bash
curl --location --request POST 'localhost:8000/logout' \
--header 'Authorization: Bearer <your-token>'
```

- POST `/logoutAll`:

Endpoint to logout from all sessions. 
Pass the Bearer token recieved from `/register` or `/login` endpoints.

Example curl:
```bash
curl --location --request POST 'localhost:8000/logoutAll' \
--header 'Authorization: Bearer <your-token>'
```

- GET `/me`:

Endpoint to get the current User
Pass the Bearer token recieved from `/register` or `/login` endpoints.

Example curl:
```bash
curl --location --request GET 'localhost:8000/me' \
--header 'Authorization: Bearer <your-token>'
```

- PATCH `changePass`:

Endpoint to change user password. If successfully executed, all the sessions except the current session is terminated.
Pass the Bearer token recieved from `/register` or `/login` endpoints.

Example curl:
```bash
curl --location --request PATCH 'localhost:8000/changePass' \
--header 'Authorization: Bearer <your-token>'
--header 'Content-Type: application/json' \
--data-raw '{
    "password": "testchangedpass"
}'
```

- DELETE `/me`:

Endpoint to delete the current user from the database.
Pass the Bearer token recieved from `/register` or `/login` endpoints.

Example curl:
```bash
curl --location --request DELETE 'localhost:8000/me' \
--header 'Authorization: Bearer <your-token>
```