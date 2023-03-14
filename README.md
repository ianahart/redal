## Redal

![redal logo](/docs/redal.png)

## Description

Redal is a reddit clone. It allows users to signup and join different communities and read posts inside those communities. I decided to make this application because I wanted to have some more practice with websockets and I wanted to understand how to the reddit upvoting system worked. It is built with React and Django.

## Features

✅ Posts </br>
✅ Communities</br>
✅ Private Communities</br>
✅ Messages</br>
✅ Notifications</br>
✅ Upvoting</br>
✅ Likes</br>
✅ User Settings</br>
✅ Friends</br>

## How To Use

Use the login information below to explore the application.

###
https://chic-empanada-6c3274.netlify.app/login </br>
-u: bluemangroup@aol.com -p Test12345%

## Run Locally

- Clone the repository
  ```sh
   https://github.com/ianahart/redal.git
  ```
- cd into the directory
  ```sh
   cd project
  ```
- Create a virtual environment
  ```sh
   virtualenv venv
  ```
  ```sh
   source venv/bin/activate
  ```
- Install dependencies pip install
  ```sh
   https://github.com/ianahart/redal.git
  ```
- Create database called redal

- Run database migrations

  ```sh
   python manage.py migrate
  ```

- Start the backend
  ```sh
   python manage.py runserver
  ```
- Start redis instance
  ```sh
   redis-server
  ```
- Change directory to start frontend

  ```sh
   cd frontend
  ```

- Install frontend dependencies

  ```sh
   npm install
  ```

- Start the frontend
  ```sh
   npm start
  ```
- Open the app
  ```sh
   http://localhost:3000
  ```

You will need to go through the files where there is websocket connections and change the protocol from wss to ws

