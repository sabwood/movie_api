const mongoose = require('mongoose');
const Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://127.0.0.1:27017/mfDB', { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

const app = express();

app.use(express.json());

const cors = require('cors');
let allowedOrigins = ['http://localhost:1234', 'https://myflix-client-sw.netlify.app'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application does not allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth.js')(app);

const passport = require('passport');
require('./passport.js');

app.use(morgan('common'));

app.use(express.static('public'));

/**
 * @summary GET welcome page
*/
app.get('/', (req, res) => {
    res.send('Welcome to myFlix application!');
});

/**
 * @summary GET all movies
 * @function
 * @async
 * @name getAllMovies
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object holding data about all movies.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary GET movie by movie title
 * @function
 * @async
 * @name getMovieByTitle
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object holding data about a single movie, containing the title, description, genre, and director.
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((title) => {
            res.json(title);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/** 
 * @summary GET movies by movie genre
 * @function
 * @async
 * @name getMoviesByGenre
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object holding data about a single genre, containing a genre name and description.
 */
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ 'Genre.Name': req.params.genreName })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary GET movies by director name
 * @function
 * @async
 * @name getMoviesByDirector
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object holding data about a single director, containing director name, biography, birth year, and death year.
 */
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ 'Director.Name': req.params.directorName })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary GET users
 * @function
 * @async
 * @name getAllUsers
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object holding all users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary GET user by username
 * @function
 * @async
 * @name getUserByUsername
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a JSON object with current user details
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary POST new user
 * @function
 * @async
 * @name userRegistration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns JSON object with new user details
 */
app.post('/users',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail(),
    ], async (req, res) => {
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users.create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });

/**
 * @summary PUT updated user info
 * @function
 * @async
 * @name editUser
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws {Error} - Error that is provided when there is a failture
 * @returns {Object} - Returns a JSON object holding data with the updated user information.
 */
app.put('/users/:Username',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], passport.authenticate('jwt', { session: false }), async (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if (req.user.Username !== req.params.Username) {
            return res.status(400).send('Permission denied');
        }

        await Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
            { new: true })
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })

    });

/**
 * @summary POST movie to users favorite movies by movie id
 * @function
 * @async
 * @name addFavoriteMovie
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a text message indicating whether the user added the movie to their favorites list successfully.
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary DELETE movie from users favorite movies by movie id
 * @function
 * @async
 * @name deleteFavoriteMovie
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a text message indicating whether the user removed the movie from their favorites list successfully.
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * @summary DELETE user by username
 * @function
 * @async
 * @name deleteUser
 * @throws {Error} - Error that is provided when there is a failure
 * @returns {Object} - Returns a text message indicating whether the user deregistered unsuccessfully.
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }

    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});