import { SpotifyPlaylist, SpotifyTrack } from "../../types/spotify.types";
import Player from "./player";
import emitEvent from "../util/emitEvent";

export default class Game {
    gameMode: string = "default";
    rounds: number = 10;
    currentRound: number = 1;
    playlist: SpotifyPlaylist;
    currentTrack: SpotifyTrack | undefined;
    roomId: string = "";
    players: { [id: string]: Player };

    constructor(
        roomId: string,
        playlist: SpotifyPlaylist,
        players: { [id: string]: Player },
    ) {
        this.roomId = roomId;
        this.playlist = playlist;
        this.players = players;
    }

    startGame() {
        emitEvent(this.roomId, "game:start");
        this.timer(5, () => this.startRound());
    }

    startRound() {
        if (this.currentRound > this.rounds) {
            this.endGame();
            return;
        }

        const randomTrackIndex = Math.floor(
            Math.random() * this.playlist.tracks.length,
        );

        this.currentTrack = this.playlist.tracks[randomTrackIndex];
        emitEvent(this.roomId, "game:roundStart", this.currentTrack);
        this.playlist.tracks.splice(randomTrackIndex, 1);
        this.currentRound++;

        this.timer(20, () => this.endRound());
    }

    endRound() {
        emitEvent(this.roomId, "game:roundEnd");

        for (const player in this.players) {
            const wasAnswerCorrect =
                this.currentTrack?.name.toLowerCase() ===
                this.players[player].answer.toLowerCase();
            this.players[player].updateScore(wasAnswerCorrect);
        }

        this.resetPlayerState();

        this.timer(5, () => this.startRound());
    }

    endGame() {
        let winner;
        let winnerScore = 0;
        for (const player in this.players) {
            const currScore = this.players[player].score;

            if (currScore > winnerScore) {
                winner = player;
                winnerScore = currScore;
            }
        }

        emitEvent(this.roomId, "game:end");

        return winner;
    }

    resetPlayerState() {
        for (const player in this.players) {
            this.players[player].updateAnswer("");
        }
    }

    timer(seconds: number, callback: () => void) {
        let secondsLeft = seconds;
        const timer = setInterval(() => {
            this.tick(secondsLeft);
            if (secondsLeft === 0) {
                clearInterval(timer);
                emitEvent(this.roomId, "game:timerDone");
                callback();
            }
            secondsLeft--;
        }, 1000);
    }

    tick(secondsLeft: number) {
        emitEvent(this.roomId, "game:tick", secondsLeft);
    }
}
