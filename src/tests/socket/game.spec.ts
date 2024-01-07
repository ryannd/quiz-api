import Game from "../../socket/game/game";
import Player from "../../socket/game/player";
import { mockSpotifyPlaylist } from "../mocks/playlist.mock";

describe("Game", () => {
    const game = new Game("test", mockSpotifyPlaylist);
    jest.useFakeTimers();

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it("should create object", () => {
        expect(game.roomId).toBe("test");
        expect(game.players).not.toBe(undefined);
    });

    describe("startGame", () => {
        it("should call emit event, timer and start round", () => {
            const emitEventSpy = jest.spyOn(game, "emitEvent");
            const timerSpy = jest.spyOn(game, "timer");
            game.startGame();
            expect(emitEventSpy).toHaveBeenCalledWith("game:start");
            expect(timerSpy).toHaveBeenCalledWith(5, expect.any(Function));
        });
    });

    describe("startRound", () => {
        it("should remove a track from playlist", () => {
            const startingPlaylistLength = game.playlist.tracks.length;
            game.startRound();
            expect(game.playlist.tracks.length).toBe(
                startingPlaylistLength - 1,
            );
        });

        it("should call emit event and timer", () => {
            const emitEventSpy = jest.spyOn(game, "emitEvent");
            const timerSpy = jest.spyOn(game, "timer");
            game.startRound();
            expect(emitEventSpy).toHaveBeenCalledWith(
                "game:roundStart",
                expect.anything(),
            );
            expect(timerSpy).toHaveBeenCalledWith(20, expect.any(Function));
        });

        it("should end game if no round left", () => {
            const endGameSpy = jest.spyOn(game, "endGame");
            game.currentRound = 11;
            game.startRound();
            expect(endGameSpy).toHaveBeenCalled();
        });
    });

    describe("endRound", () => {
        it("should call emit event and timer", () => {
            const emitEventSpy = jest.spyOn(game, "emitEvent");
            const timerSpy = jest.spyOn(game, "timer");
            game.endRound();
            expect(emitEventSpy).toHaveBeenCalledWith("game:roundEnd");
            expect(timerSpy).toHaveBeenCalledWith(5, expect.any(Function));
        });

        it("should update player answer", () => {
            const player = new Player("test", "test", "test");
            const updateAnswerSpy = jest.spyOn(player, "updateScore");
            game.addPlayer(player);
            game.endRound();
            expect(updateAnswerSpy).toHaveBeenCalled();
        });
    });

    describe("endGame", () => {
        it("should pick winner", () => {
            const player1 = new Player("test1", "test", "test");
            const player2 = new Player("test", "test", "test");
            game.addPlayer(player1);
            game.addPlayer(player2);
            player2.score = 99999;
            const winner = game.endGame();
            expect(winner).toBe(player2.id);
        });

        it("should call emitEvent", () => {
            const emitEventSpy = jest.spyOn(game, "emitEvent");
            game.endGame();
            expect(emitEventSpy).toHaveBeenCalled();
        });
    });

    describe("resetPlayerState", () => {
        it("should set player answers to empty string", () => {
            for (const player in game.players) {
                game.players[player].answer = "sakjdfhasdjklhf";
            }
            game.resetPlayerState();
            for (const player in game.players) {
                expect(game.players[player].answer).toBe("");
            }
        });
    });

    describe("addPlayer", () => {
        it("should add a player", () => {
            const newPlayer = new Player("test2", "test", "test");
            game.addPlayer(newPlayer);
            expect(game.players[newPlayer.id]).toEqual(newPlayer);
        });
    });

    describe("removePlayer", () => {
        it("should remove a player", () => {
            game.removePlayer("test2");
            expect(game.players["test2"]).toBe(undefined);
        });
    });

    describe("timer", () => {
        it("should countdown and invoke callback function", () => {
            const callback = jest.fn();
            const tickSpy = jest.spyOn(game, "tick");
            const emitEventSpy = jest.spyOn(game, "emitEvent");
            game.timer(2, callback);

            jest.advanceTimersByTime(3000);

            expect(tickSpy).toHaveBeenCalledWith(2);
            expect(tickSpy).toHaveBeenCalledWith(1);

            expect(emitEventSpy).toHaveBeenCalledWith("game:timerDone");

            expect(callback).toHaveBeenCalled();
        });
    });
});
