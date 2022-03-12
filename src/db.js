const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/dealers_choice_react_wp', {logging: false});

const Hero = db.define('hero', {
    name: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    weaponType: {
        type: Sequelize.ENUM('Sword', 'Lance', 'Axe', 'Tome'),
        allowNull: false
    }
});

const Game = db.define('game', {
    name: {
        type: Sequelize.STRING(40),
        defaultValue: "Unknown",
        allowNull: false
    },
    year: {
        type: Sequelize.STRING(10),
        allowNull: false
    }
});

Hero.belongsTo(Game);
Game.hasMany(Hero);

Hero.getGameNames = function () {
    return this.findAll( {
        include: [
            {model: Game}
        ]
    })
}

async function seedDb() {
    try {
        await db.sync({force: true});
        const FE_ME = await Game.create({name: 'Fire Emblem: Mystery of the Emblem', year: '1994'});
        const FE_BB = await Game.create({name: 'Fire Emblem: The Blazing Blade', year: '2003'});
        const FE_SS = await Game.create({name: 'Fire Emblem: The Sacred Stones', year: '2004'});
        const FE_A = await Game.create({name: 'Fire Emblem: Awakening', year: '2012'});

        await Hero.create({name: 'Marth', weaponType: 'Sword', gameId: FE_ME.id});
        await Hero.create({name: 'Eliwood', weaponType: 'Sword', gameId: FE_BB.id});
        await Hero.create({name: 'Hector', weaponType: 'Axe', gameId: FE_BB.id});
        await Hero.create({name: 'Ephraim', weaponType: 'Lance', gameId: FE_SS.id});
        await Hero.create({name: 'Tharja', weaponType: 'Tome', gameId: FE_A.id});
        console.log('Seeded!');
        
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    db, seedDb, Hero, Game
};