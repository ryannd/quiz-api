import generateRoomCode from "../helpers/generateRoomCode";
import Game from "./game";
import Player from "./player";

export default class Room {
    game: Game;
    id: string;
    host: string;
    players: string[] = [];

    constructor(host: string) {
        this.id = generateRoomCode();
        this.game = new Game(this.id);
        this.host = host;
    }

    startGame() {
        this.addPlayersToGame();
    }

    playerConnect(id: string) {
        // TODO: add support for user obj
        this.players.push(id);
        return this.players;
    }

    playerDisconnect(id: string) {
        const indexOfPlayer = this.players.indexOf(id);

        if (indexOfPlayer > -1) {
            this.players.splice(indexOfPlayer, 1);
        }

        return this.players;
    }

    addPlayersToGame() {
        if (!this.game) {
            return;
        }

        for (const player of this.players) {
            // TODO: after support for user obj, pass in name
            this.game.players[player] = new Player(player, "");
        }
    }
}
