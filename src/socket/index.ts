import { Server } from "socket.io";
import { createServer } from "http";
import Koa from "koa";

export default function initSocket(
    app: Koa<Koa.DefaultState, Koa.DefaultContext>,
) {
    const httpServer = createServer(app.callback());
    const io = new Server(httpServer, {
        path: "/socket",
    });

    io.on("connection", (socket) => {
        console.log(socket.id);
    });

    return httpServer;
}
