import Room from "../../socket/game/room";
import * as spotifyService from "../../services/spotify.service";
import { mockSpotifyPlaylist } from "../mocks/playlist.mock";

jest.mock("../../services/spotify.service");

describe("Room", () => {
    const room = new Room("test");

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
    });

    it("should work", () => {
        expect(room.hostId).toBe("test");
        expect(room.id).toBeTruthy();
    });

    describe("startGame", () => {
        beforeAll(() => {
            room.playerConnect("test");
        });

        it("should throw when starting game without a playlist", () => {
            expect(() => {
                room.startGame();
            }).toThrow(`playlist not selected in room ${room.id}`);
        });

        it("should create a new game", async () => {
            jest.spyOn(spotifyService, "getSpotifyPlaylist").mockResolvedValue(
                mockSpotifyPlaylist,
            );
            const addPlayerSpy = jest.spyOn(room, "addPlayersToGame");

            await room.changePlaylist("test");

            room.startGame();

            expect(room.game).toBeTruthy();
            expect(addPlayerSpy).toHaveBeenCalledWith(room.game);
        });
    });

    describe("playerConnect", () => {
        it("should add player to player list", () => {
            room.playerConnect("tester");
            expect(room.players).toContain("tester");
        });
        it("should throw if player already in room", () => {
            expect(() => {
                room.playerConnect("tester");
            }).toThrow("player already in room");
        });
    });

    describe("playerDisconnect", () => {
        it("should remove player from player list", () => {
            room.playerDisconnect("tester");
            expect(room.players).not.toContain("tester");
        });

        it("should throw if player not in room", () => {
            expect(() => {
                room.playerDisconnect("tester");
            }).toThrow("player not in room");
        });
    });
});
