import { Server } from "socket.io";
import {
    IncomingMessage,
    ServerResponse,
    Server as HttpServerType,
} from "http";
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

    init(
        httpServer: HttpServerType<
            typeof IncomingMessage,
            typeof ServerResponse
        >,
    ) {
        this.io = new Server(httpServer, {
            path: "/socket",
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            },
        });

        this.initEvents();
    }

    initEvents() {
        this.io?.on("connection", (socket) => {
            socket.on(
                "socket:join",
                async (data: { roomId: string; name: string }) => {
                    try {
                        const room = onPlayerJoin(socket.id, data);

                        if (room) {
                            await socket.join(room.id);
                        }
                    } catch (e: unknown) {
                        if (e instanceof Error) {
                            console.error(e.message);
                        }
                    }
                },
            );
            socket.on("socket:createRoom", (data: { roomId: string }) =>
                onCreateRoom(socket.id, data.roomId),
            );
            socket.on("room:gameStart", () => onGameStart(socket.id));
            socket.on("disconnect", () => {
                try {
                    onPlayerLeave(socket.id);
                } catch (e: unknown) {
                    if (e instanceof Error) {
                        console.error(e.message);
                    }
                }
            });
            socket.on("room:playlistChange", (data: { playlistId: string }) =>
                onPlaylistChange(socket.id, data),
            );
            socket.on("game:answerChange", (data: { answer: string }) =>
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
