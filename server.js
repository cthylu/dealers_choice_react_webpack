const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { db, seedDb, Hero, Game } = require('./src/db');

app.use('/src', express.static(path.join(__dirname, '/src')));
app.use('/public', express.static(path.join(__dirname, '/public')));

//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/api/games', async (req, res, next) => {
    try {
        const game = {
            name: req.body.name,
            year: req.body.year
        };
        await Game.create(game);
        res.status(201).redirect('/');
    } catch(err) {
        next(err);
    }
});
app.post('/api/heroes', async (req, res, next) => {
    try {
        const hero = {
            name: req.body.name,
            weaponType: req.body.weapon,
            gameId: req.body.game
        };
        await Hero.create(hero, {
            include: [Game]
        });
        res.status(201).redirect('/');
    } catch(err) {
        next(err);
    }
});

app.get('/api/heroes', async(req, res, next) => {
    try {
        res.send(await Hero.findAll());
    } catch(err) {
        next(err);
    }
});
app.get('/api/games', async(req, res, next) => {
    try {
        res.send(await Game.findAll());
    } catch(err) {
        next(err);
    }
});

app.get('/', async(req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
    try {
        await db.authenticate();
        await seedDb(); 
        app.listen(port, function() {
            console.log(`Listening on port ${port}!`);
        })
    } catch(err) {
        console.log(err);
    }
}
start();