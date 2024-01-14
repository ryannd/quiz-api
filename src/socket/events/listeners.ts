import io from "..";
import Room from "../game/room";

export const onCreateRoom = (hostId: string) => {
    const room = new Room(hostId);
    const roomId = room.id;
    io.rooms[roomId] = room;

    console.log(`[SOCKET]: Room: ${room.id} created!`);

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
        room = onCreateRoom(playerId);
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
        return;
    }

    room.playerDisconnect(playerId);

    console.log(`[SOCKET]: Player ${playerId} left room ${room.id}!`);
};

export const onGameStart = (playerId: string) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (!room) {
        return;
    }

    try {
        room.startGame();

        console.log(`[SOCKET]: Room: ${room.id} started their game!`);
    } catch {
        console.log(
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
        return;
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
    const playerObj = room.game?.players[playerId];

    if (playerObj) {
        playerObj.updateAnswer(answer);
    }
};

export const onPlayerReady = (playerId: string) => {
    const roomId = io.players[playerId];
    const room = io.rooms[roomId];

    if (room) {
        room.playerReady(playerId);
    }
};
