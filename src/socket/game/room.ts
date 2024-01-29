import { getSpotifyPlaylist } from "../../services/spotify.service";
import { SpotifyPlaylist } from "../../types/spotify.types";
import Game from "./game";
import Player from "./player";
import emitEvent from "../util/emitEvent";

export default class Room {
    game: Game | undefined;
    id: string;
    hostId: string;
    players: { [id: string]: Player } = {};
    playlist: SpotifyPlaylist | undefined;
    numReady: number = 0;

    constructor(host: string, id: string) {
        this.hostId = host;
        this.id = id;
    }

    startGame() {
        if (!this.playlist) {
            throw new Error(`playlist not selected in room ${this.id}`);
        }

        const newGame = new Game(this.id, this.playlist, this.players);
        this.game = newGame;
        this.game.startGame();

        return this.game;
    }

    playerConnect(id: string, name: string) {
        if (this.players[id] !== undefined) {
            throw new Error(`player already exists in room ${this.id}`);
        }

        const newPlayer = new Player(id, name, this.id);
        this.players[id] = newPlayer;
    }

    playerDisconnect(id: string) {
        const player = this.players[id];

        if (player) {
            delete this.players[id];
        } else {
            throw new Error("player not in room");
        }

        return this.players;
    }

    playerReady(id: string) {
        const player = this.players[id];

        if (player && !player.ready) {
            player.onReady();
            this.numReady++;
            emitEvent(this.id, "room:playerReady", { playerId: id });
        }

        if (!player) {
            throw new Error("player not in room");
        }
    }

    async changePlaylist(playlistId: string) {
        this.playlist = await getSpotifyPlaylist(playlistId);
    }
}
