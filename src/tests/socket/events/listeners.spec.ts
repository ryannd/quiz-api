import {
    onAnswerChange,
    onCreateRoom,
    onGameStart,
    onPlayerJoin,
    onPlayerLeave,
    onPlayerReady,
    onPlaylistChange,
} from "../../../socket/events/listeners";
import io from "../../../socket/index";
import { mockSpotifyPlaylist } from "../../mocks/playlist.mock";

describe("Event Listeners", () => {
    jest.useFakeTimers();

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    const globalRoom = onCreateRoom("test");

    describe("onCreateRoom", () => {
        it("should create a room", () => {
            expect(globalRoom).toBeTruthy();
        });

        it("should store room in socket", () => {
            expect(io.rooms[globalRoom.id]).toBeTruthy();
        });
    });

    describe("onPlayerJoin", () => {
        it("should throw if room does not exist", () => {
            expect(() => {
                onPlayerJoin("tester", { roomId: "1", name: "tester" });
            }).toThrow(`[ERROR] Joining failed. Room: 1 does not exist!`);
        });

        it("should add player to room", () => {
            const connectSpy = jest.spyOn(
                io.rooms[globalRoom.id],
                "playerConnect",
            );
            onPlayerJoin("tester", { roomId: globalRoom.id, name: "tester" });

            expect(connectSpy).toHaveBeenCalled();
            expect(io.players["tester"]).toBeTruthy();
        });

        it("should not add existing player to room", () => {
            const connectSpy = jest.spyOn(
                io.rooms[globalRoom.id],
                "playerConnect",
            );
            const playerRoom = onPlayerJoin("tester", {
                roomId: globalRoom.id,
                name: "tester",
            });
            expect(connectSpy).not.toHaveBeenCalled();
            expect(playerRoom).toBeTruthy();
        });
    });

    describe("onPlayerLeave", () => {
        const newRoom = onCreateRoom("player");
        onPlayerJoin("player", { roomId: newRoom.id, name: "player" });

        it("should throw if player is not in a room", () => {
            expect(() => {
                onPlayerLeave("nope");
            }).toThrow(`[ERROR] Leaving failed. Player nope is not in a room!`);
        });

        it("should remove player from room", () => {
            onPlayerLeave("player");
            expect(io.players["player"]).toBeFalsy();
            expect(globalRoom.players["player"]).toBeFalsy();
        });

        it("should delete room if room is empty", () => {
            // last test deleted room
            expect(io.rooms[newRoom.id]).toBeFalsy();
        });
    });

    describe("onGameStart", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        it("should throw if player not in room ", () => {
            expect(() => {
                onGameStart("nope");
            }).toThrow(
                `[ERROR] Game start failed. Player nope is not in a room!`,
            );
        });

        it("should start game", () => {
            const roomStartSpy = jest
                .spyOn(globalRoom, "startGame")
                .mockReturnThis();
            onGameStart("tester");
            expect(roomStartSpy).toHaveBeenCalled();
        });

        it("should throw if starting game throws", () => {
            jest.spyOn(globalRoom, "startGame").mockImplementationOnce(() => {
                throw new Error();
            });
            expect(() => {
                onGameStart("tester");
            }).toThrow(
                `[ERROR] Room: ${globalRoom.id} had an error starting their game`,
            );
        });
    });

    describe("onPlaylistChange", () => {
        it("should change playlist", async () => {
            const changeSpy = jest
                .spyOn(globalRoom, "changePlaylist")
                .mockImplementation(async () => {});
            await onPlaylistChange("tester", { playlistId: "test" });
            expect(changeSpy).toHaveBeenCalled();
        });

        it("should throw if player not in room", () => {
            expect(async () => {
                await onPlaylistChange("player", { playlistId: "test" });
            }).rejects.toThrow(`[ERROR] Playlist change failed`);
        });

        it("should throw if playlistid is empty or null", () => {
            expect(async () => {
                await onPlaylistChange("tester", { playlistId: "" });
            }).rejects.toThrow(`[ERROR] Playlist change failed`);
        });
    });

    describe("onAnswerChange", () => {
        beforeAll(() => {
            jest.restoreAllMocks();
        });

        it("should update answer", () => {
            globalRoom.playlist = mockSpotifyPlaylist;
            const game = globalRoom.startGame();

            const updateSpy = jest.spyOn(
                game.players["tester"],
                "updateAnswer",
            );
            onAnswerChange("tester", { answer: "testing" });

            expect(updateSpy).toHaveBeenCalledWith("testing");
        });

        it("should throw if player not found", () => {
            expect(() => {
                onAnswerChange("nope", { answer: "" });
            }).toThrow(
                `[ERROR] Answer change failed. Player nope does not exist!`,
            );
        });
    });

    describe("onPlayerReady", () => {
        it("should set player ready status", () => {
            const readySpy = jest.spyOn(globalRoom, "playerReady");
            onPlayerReady("tester");
            expect(readySpy).toHaveBeenCalledWith("tester");
        });

        it("should throw if player not in room", () => {
            expect(() => {
                onPlayerReady("nope");
            }).toThrow(
                `[ERROR] Player ready failed. Player nope is not in a room!`,
            );
        });
    });
});
