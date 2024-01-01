import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { IncomingMessage, ServerResponse } from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import Game from "./game/game";

class Socket {
    io:
        | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
        | undefined;

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

        this.io.on("connection", (socket) => {
            socket.join("test");
            const game = new Game("test");
            game.timer(5);
        });
    }

    getIo() {
        return this.io;
    }
}

export default new Socket();
