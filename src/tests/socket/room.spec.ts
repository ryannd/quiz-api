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
        it("should throw when starting game without a playlist", () => {
            expect(() => {
                room.startGame();
            }).toThrow(`playlist not selected in room ${room.id}`);
        });

        it("should create a new game", async () => {
            jest.spyOn(spotifyService, "getSpotifyPlaylist").mockResolvedValue(
                mockSpotifyPlaylist,
            );

            await room.changePlaylist("test");

            room.startGame();

            expect(room.game).toBeTruthy();
        });
    });

    describe("playerConnect", () => {
        it("should add player to player list", () => {
            room.playerConnect("tester", "test");
            expect(room.players).toMatchObject({
                tester: {
                    answer: "",
                    id: "tester",
                    name: "test",
                    room: room.id,
                    score: 0,
                },
            });
        });
        it("should throw if player already in room", () => {
            expect(() => {
                room.playerConnect("tester", "test");
            }).toThrow(`player already exists in room ${room.id}`);
        });
    });

    describe("playerDisconnect", () => {
        it("should remove player from player list", () => {
            room.playerDisconnect("tester");
            expect(room.players).not.toContain({
                tester: {
                    answer: "",
                    id: "tester",
                    name: "test",
                    room: room.id,
                    score: 0,
                },
            });
        });

        it("should throw if player not in room", () => {
            expect(() => {
                room.playerDisconnect("tester");
            }).toThrow("player not in room");
        });
    });

    describe("playerReady", () => {
        room.playerConnect("tester1", "test");
        const player = room.players["tester1"];

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should ready player", () => {
            const readySpy = jest.spyOn(player, "onReady");
            room.playerReady("tester1");

            expect(readySpy).toHaveBeenCalled();
            expect(player.ready).toBe(true);
        });

        it("should not call when player already ready", () => {
            const readySpy = jest.spyOn(player, "onReady");
            room.playerReady("tester1");

            expect(readySpy).not.toHaveBeenCalled();
        });

        it("should throw if player not in room", () => {
            expect(() => {
                room.playerReady("nope");
            }).toThrow("player not in room");
        });
    });
});
