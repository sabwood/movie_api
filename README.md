# movie_api
A movie API and a server-side application that provides movie and user management with features like authentication and data validation.

## Features
- User registration, login, and deletion
- Displayed list of movies with accessible details about each movie, director, and genre
- Button to add or remove movies from favorite movies list

## Technical Requirements
- Node.js and npm
- Express.js
- MongoDB
- Passport.js
- CORS
- Mongoose

## API Endpoints
- Get all movies: `/movies/`
- Get a movie by title: `/movies/[Title]/`
- Get movies by genre: `/movies/genre/[genreName]/`
- Get movies by director name: `/movies/directors/[directorName]/`
- Get users: `/users/`
- Get user by username: `/users/[Username]/`
- Register new user: `/users/`
- Update user information: `/users/[Username]/`
- Add/remove a movie from users favorite movies list: `/users/[Username]/movies/[MovieID]/`
- Delete user by username: `/users/[Username]/`

## Setup Instructions
1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```
2. Navigate into the project directory and install the necessary dependencies
   ```bash
   cd <your-repo-name>
   npm install
   ```
3. Run the application locally.
   ```bash
   npm start
   ```
4. To run tests:
   ```bash
   npm test
   ```
