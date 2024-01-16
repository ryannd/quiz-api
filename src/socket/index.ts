import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { IncomingMessage, ServerResponse } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Room from "./game/room";
import {
    onPlayerJoin,
    onCreateRoom,
    onGameStart,
    onPlayerLeave,
    onPlaylistChange,
    onAnswerChange,
    onPlayerReady,
} from "./events/listeners";

class Socket {
    io:
        | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
        | undefined;

    rooms: { [key: string]: Room } = {};
    players: { [key: string]: string } = {};

    constructor() {}

    init(
        httpServer: HttpServerType<
            typeof IncomingMessage,
            typeof ServerResponse
        >,
    ) {
        this.io = new Server(httpServer, {
            path: "/socket",
        });

        this.initEvents();
    }

    initEvents() {
        this.io?.on("connection", (socket) => {
            socket.on("socket:join", (data) => {
                try {
                    const room = onPlayerJoin(socket.id, data);

                    if (room) {
                        socket.join(room.id);
                    }
                } catch (e) {
                    console.error(e);
                }
            });
            socket.on("socket:createRoom", () => onCreateRoom(socket.id));
            socket.on("room:gameStart", () => onGameStart(socket.id));
            socket.on("disconnect", () => onPlayerLeave(socket.id));
            socket.on("room:playlistChange", (data) =>
                onPlaylistChange(socket.id, data),
            );
            socket.on("game:answerChange", (data) =>
                onAnswerChange(socket.id, data),
            );
            socket.on("room:playerReady", () => onPlayerReady(socket.id));
        });
    }

    getIo() {
        return this.io;
    }
}

export default new Socket();
