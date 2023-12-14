import { SpotifyPlaylist, SpotifyTrack } from "../../types/spotify.types";
import Player from "./player";

export default class Game {
    players: { [id: string]: Player } = {};
    gameMode: string = "default";
    rounds: number = 10;
    currentRound: number = 1;
    playlist: SpotifyPlaylist | undefined;
    currentTrack: SpotifyTrack | undefined;

    constructor() {}

    startRound() {
        if (!this.playlist) {
            return;
        }

        const randomTrackIndex = Math.floor(
            Math.random() * this.playlist?.tracks.length,
        );
        this.currentTrack = this.playlist.tracks[randomTrackIndex];

        this.playlist.tracks.splice(randomTrackIndex, 1);
    }

    endRound() {
        for (const player in this.players) {
            const wasAnswerCorrect =
                this.currentTrack?.name === this.players[player].answer;
            this.players[player].updateScore(wasAnswerCorrect);
        }
    }

    resetPlayerState() {
        for (const player in this.players) {
            this.players[player].updateAnswer("");
        }
    }
}
