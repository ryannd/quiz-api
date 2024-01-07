import { getSpotifyPlaylist } from "../../services/spotify.service";
import { SpotifyPlaylist } from "../../types/spotify.types";
import Game from "./game";
import Player from "./player";

export default class Room {
    game: Game | undefined;
    id: string;
    hostId: string;
    players: string[] = [];
    playlist: SpotifyPlaylist | undefined;

    constructor(host: string) {
        this.id = Room.generateRoomCode();
        this.hostId = host;
    }

    startGame() {
        if (!this.playlist) {
            return;
        }

        const newGame = new Game(this.id, this.playlist);
        this.game = newGame;
        this.addPlayersToGame(newGame);
        this.game.startGame();
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

        if (this.game) {
            this.game.removePlayer(id);
        }

        return this.players;
    }

    addPlayersToGame(game: Game) {
        for (const player of this.players) {
            // TODO: after support for user obj, pass in name
            const newPlayer = new Player(player, "", this.id);
            game.addPlayer(newPlayer);
        }
    }

    async changePlaylist(playlistId: string) {
        this.playlist = await getSpotifyPlaylist(playlistId);
    }

    static generateRoomCode() {
        return Math.random().toString(36).substring(2, 7);
    }
}
