const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { db, seedDb, Hero, Game } = require('./src/db');

app.use('/src', express.static(path.join(__dirname, '/src')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.post('/api/heroes', (req, res, next) => {
    const hero = {
        name: req.body.name,
        weaponType: req.body.weaponType,
        gameId: req.body.gameId
    }
    res.status(201).send(hero);
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