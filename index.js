const express = require('express'),
morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        title: 'movieOne',
        genre: 'genreExample',
        director: 'directorOne',
        description: 'descriptionOne'
    },
    {
        title: 'movieTwo',
        genre: 'genreExample',
        director: 'directorTwo',
        description: 'descriptionTwo'
    },
    {
        title: 'movieThree',
        genre: 'genreExample',
        director: 'directorThree',
        description: 'descriptionThree'
    },
    {
        title: 'movieFour',
        genre: 'genreExample',
        director: 'directorFour',
        description: 'descriptionFour'
    },
    {
        title: 'movieFive',
        genre: 'genreExample',
        director: 'directorFive',
        description: 'descriptionFive',
    },
    {
        title: 'movieSix',
        genre: 'genreExample',
        director: 'directorSix',
        description: 'descriptionSix'
    },
    {
        title: 'movieSeven',
        genre: 'genreExample',
        director: 'directorSeven',
        description: 'descriptionSeven'
    },
    {
        title: 'movieEight',
        genre: 'genreExample',
        director: 'directorEight',
        description: 'descriptionEight'
    },
    {
        title: 'movieNine',
        genre: 'genreExample',
        director: 'directorNine',
        description: 'descriptionNine'
    },
    {
        title: 'movieTen',
        genre: 'genreExample',
        director: 'directorTen',
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('My server is running on port 8080.');
});