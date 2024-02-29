const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

let users = [
    {
        id: '1',
        username: 'exampleUsername',
        name: 'exampleName',
        favoriteMovies: ['movieOne']
    }
]

let topMovies = [
    {
        title: 'movieOne',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionOne'
    },
    {
        title: 'movieTwo',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionTwo'
    },
    {
        title: 'movieThree',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionThree'
    },
    {
        title: 'movieFour',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionFour'
    },
    {
        title: 'movieFive',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionFive',
    },
    {
        title: 'movieSix',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionSix'
    },
    {
        title: 'movieSeven',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionSeven'
    },
    {
        title: 'movieEight',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionEight'
    },
    {
        title: 'movieNine',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionNine'
    },
    {
        title: 'movieTen',
        genre: {
            genreName: 'genreNameExample',
            genreDescription: 'descriptionExample'
        },
        director: {
            directorName: 'directorNameExample',
            birthYear: '####'
        },
        description: 'descriptionTen'
    }
];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to myFlix application!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
    let title = req.params.title;
    let movie = topMovies.find( movie => movie.title === title);

    if (!movie) {
        res.status(400).send('There is no such movie.');
    } else {
        res.status(200).json(movie)
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    let genreName = req.params.genreName;
    let genre = topMovies.find( movie => movie.genre.genreName === genreName).genre;

    if (!genre) {
        res.status(400).send('There is no such genre.');
    } else {
        res.status(200).json(genre)
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    let directorName = req.params.directorName;
    let director = topMovies.find( movie => movie.director.directorName === directorName ).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('There is no such director.')
    }
});

app.post('/users', (req,res) => {
    let newUser = req.body;

    if (!newUser.username) {
        const message = 'Missing username in request body.';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

app.put('/users/:id', (req,res) => {
    let id = req.params.id;
    let updatedUsername = req.body;

    let user = users.find( user => user.id === id );

    if (!user) {
        res.status(400).send('There is no such user.')
    } else {
        user.username = updatedUsername.username;
        res.status(200).json(user);
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    let id = req.params.id;
    let movieTitle = req.params.movieTitle;

    let user = users.find( user => user.id === id );

    if (!user) {
        res.status(400).send('There is no such user.')
    } else {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has been added to ' + id + '\'s favorite\'s list.');
    }
});

app.delete('/users/:id/:movieTitle', (req,res) => {
    let id = req.params.id;
    let movieTitle = req.params.movieTitle;

    let user = users.find( user => user.id === id );

    if (!user) {
        res.status(400).send('There is no such user.')
    } else {
        user.favoriteMovies = user.favoriteMovies.filter((title) => title !== movieTitle);
        res.status(200).send(movieTitle + ' has been removed from ' + id + '\'s favorite\'s list.');
    }
});

app.delete('/users/:id', (req, res) => {
    let id = req.params.id;

    let user = users.find( user => user.id === id );

    if (!user) {
        res.status(400).send('There is no such user.')
    } else {
        users = users.filter( user => user.id != id);
        res.status(200).send('User ' + id + ' has been deleted.');
    }
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('My server is running on port 8080.');
});