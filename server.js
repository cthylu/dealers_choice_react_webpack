const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { db, seedDb, Hero, Game } = require('./db/db');

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

/*app.get('/', async(req, res, next) => {
    res.sendFile(path.join(__dirname, '.', 'client', 'index.html'));
});*/

app.get('/', async(req, res, next) => {
    const heroes = await Hero.findAll();
    const games = await Game.findAll();
    const html = `
    <html>
        <head>
            <title>Dealers Choice React w/webpack</title>
            <style>
                th, td {
                    padding: 6px 12px;
                }
                td {
                    border: 1px solid #505050;
                }
            </style>
        </head>
        <body>
            <h1>Fire Emblem Heroes</h1>
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Weapon</th>
                        <th>Game Title</th>
                    </tr>
                    ${heroes.map((hero) => {
                        return (`
                            <tr>
                                <td>${hero.name}</td>
                                <td>${hero.weaponType}</td>
                                <td>${hero.gameId}</td>
                            </tr>
                        `)
                    }).join('')}
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Game Name</th>
                        <th>Year</th>
                    </tr>
                    ${games.map((game) => {
                        return (`
                            <tr>
                                <td>${game.id}</td>
                                <td>${game.name}</td>
                                <td>${game.year}</td>
                            </tr>
                        `)
                    }).join('')}
                </tbody>
            </table>
            <h2>Add a Game!</h2>
            <form action="/api/games" method="POST">
                <label>Game Name:</label>
                <input type="text" name="name">
                <label>Year:</label>
                <input type="text" name="year">
                <input type="submit">
            </form>
        </body>
    </html>
    `
    res.send(html);
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