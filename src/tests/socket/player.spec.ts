import Player from "../../socket/game/player";

describe("Player", () => {
    const player = new Player("testid", "name", "test");

    it("should construct correctly", () => {
        expect(player.name).toBe("name");
        expect(player.id).toBe("testid");
        expect(player.room).toBe("test");
        expect(player.score).toBe(0);
        expect(player.answer).toBe("");
    });

    describe("updateScore", () => {
        it("should update score", () => {
            player.updateScore(true);
            expect(player.score).toBe(10);
            player.updateScore(false);
            expect(player.score).toBe(10);
        });
    });

    describe("updateAnswer", () => {
        it("should update answer", () => {
            player.updateAnswer("test");
            expect(player.answer).toBe("test");
        });
    });
});
