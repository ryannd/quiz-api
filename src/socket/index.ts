import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { IncomingMessage, ServerResponse } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Room from "./game/room";
import Player from "./game/player";
import { onPlayerJoin } from "./events/listeners";

class Socket {
    io:
        | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
        | undefined;

    rooms: { [key: string]: Room } = {};
    players: { [key: string]: Player } = {};

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

        // todo: remove test code
        this.io.on("connection", async (socket) => {
            const room = onPlayerJoin(socket.id);
            socket.join(room.id);
            await room.changePlaylist("4PLDHWXGiXcgbQOa1FuebT");
            room.startGame();
        });
    }

    getIo() {
        return this.io;
    }
}

export default new Socket();
