import io from "..";
import Room from "../game/room";

export const onCreateRoom = (hostId: string) => {
    const room = new Room(hostId);
    const roomId = room.id;
    io.rooms[roomId] = room;

    return room;
};

export const onPlayerJoin = (playerId: string, roomId: string = "") => {
    let room = io.rooms[roomId];

    if (room === undefined) {
        room = onCreateRoom(playerId);
    }

    room.playerConnect(playerId);

    return room;
};

export const onPlayerLeave = (playerId: string) => {
    const roomId = io.players[playerId].room;
    const room = io.rooms[roomId];

    room.playerDisconnect(playerId);
};

export const onGameStart = (roomId: string) => {
    const room = io.rooms[roomId];
    room.startGame();
};
