import io from "..";
import Room from "../game/room";

export const onCreateRoom = (hostId: string, id: string) => {
    const room = new Room(hostId, id);
    io.rooms[id] = room;

    console.log(`[SOCKET]: Room: ${id} created!`);

    return room;
};

export const onPlayerJoin = (
    playerId: string,
    { roomId = "", name = "" }: { roomId: string; name: string },
) => {
    let room = io.rooms[roomId];
    const playerExists = io.players[playerId];

    if (playerExists) {
        return io.rooms[roomId];
    }

    if (room === undefined || roomId === "") {
        room = onCreateRoom(playerId, roomId);
    }

    io.players[playerId] = room.id;

    room.playerConnect(playerId, name);

    console.log(`[SOCKET]: Player ${playerId} joined room ${room.id}!`);

    return room;
};

export const onPlayerLeave = (playerId: string) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (!room || !roomId) {
        throw new Error(
            `[ERROR] Leaving failed. Player ${playerId} is not in a room!`,
        );
    }

    delete io.players[playerId];
    room.playerDisconnect(playerId);

    console.log(`[SOCKET]: Player ${playerId} left room ${room.id}!`);

    if (Object.entries(room.players).length === 0) {
        delete io.rooms[roomId];
    }
};

export const onGameStart = (playerId: string) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (!room) {
        throw new Error(
            `[ERROR] Game start failed. Player ${playerId} is not in a room!`,
        );
    }

    try {
        room.startGame();
        console.log(`[SOCKET]: Room: ${room.id} started their game!`);
    } catch {
        throw new Error(
            `[ERROR] Room: ${room.id} had an error starting their game`,
        );
    }
};

export const onPlaylistChange = async (
    playerId: string,
    { playlistId = "" }: { playlistId: string },
) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (!room || playlistId === "") {
        throw new Error(`[ERROR] Playlist change failed`);
    }

    await room.changePlaylist(playlistId);

    console.log(
        `[SOCKET]: Room: ${room.id} changed their playlist to ${playlistId}!`,
    );
};

export const onAnswerChange = (
    playerId: string,
    { answer = "" }: { answer: string },
) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];
    const playerObj = room ? room.game?.players[playerId] : null;

    if (playerObj) {
        playerObj.updateAnswer(answer);
    } else {
        throw new Error(
            `[ERROR] Answer change failed. Player ${playerId} does not exist!`,
        );
    }
};

export const onPlayerReady = (playerId: string) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (room) {
        room.playerReady(playerId);
    } else {
        throw new Error(
            `[ERROR] Player ready failed. Player ${playerId} is not in a room!`,
        );
    }
};
