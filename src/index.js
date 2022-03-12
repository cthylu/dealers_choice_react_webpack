import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';

const HeroList = (props) => {
    const heroes = props.heroes;
    return (
        <table>
            <tbody>
                <tr>
                    <th>Name</th>
                    <th>Weapon</th>
                    <th>Game Title</th>
                </tr>
                {
                    heroes.map((hero) => {
                        return (
                            <tr>
                                <td>{hero.name}</td>
                                <td>{hero.weaponType}</td>
                                <td>{hero.gameId}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}
const GameList = (props) => {
    const games = props.games;
    return (
        <table>
            <tbody>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
                {
                    games.map((game) => {
                        return (
                            <tr>
                                <td>{game.id}</td>
                                <td>{game.name}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            heroes: [],
            games: []
        }
    }

    async componentDidMount() {
        try {
            const response = await axios.get('/api/heroes');
            const heroes = response.data;
            const gamesResponse = await axios.get('/api/games');
            const games = gamesResponse.data;
            this.setState({heroes, games});
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div>
                <h1>Fire Emblem Heroes</h1>
                <HeroList heroes={this.state.heroes} />
                <GameList games={this.state.games} />
            </div>
        );
    }
}

const root = document.querySelector('#root');
ReactDOM.render(<Main />, root);