import { getSpotifyPlaylist } from "../../services/spotify.service";
import { SpotifyPlaylist } from "../../types/spotify.types";
import Game from "./game";
import Player from "./player";
import io from "..";

export default class Room {
    game: Game | undefined;
    id: string;
    hostId: string;
    players: { [id: string]: Player } = {};
    playlist: SpotifyPlaylist | undefined;
    numReady: number = 0;

    constructor(host: string) {
        this.id = Room.generateRoomCode();
        this.hostId = host;
    }

    startGame() {
        if (!this.playlist) {
            throw new Error(`playlist not selected in room ${this.id}`);
        }

        const newGame = new Game(this.id, this.playlist, this.players);
        this.game = newGame;
        this.game.startGame();
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

        if (!player.ready) {
            player.onReady();
            this.numReady++;
            this.emitEvent("room:playerReady", { playerId: id });
        }
    }

    async changePlaylist(playlistId: string) {
        this.playlist = await getSpotifyPlaylist(playlistId);
    }

    static generateRoomCode() {
        return Math.random().toString(36).substring(2, 7);
    }

    // todo: standardize type
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    emitEvent(eventString: string, data: any = {}) {
        io.getIo()?.in(this.id).emit(eventString, data);
    }
}
