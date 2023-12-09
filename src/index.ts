import Koa from "koa";
import json from "koa-json";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import { Server } from "socket.io";
import { createServer } from "http";
import "dotenv/config";

import { router as spotifyRouter } from "./routes/spotify.route";

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer);

const PORT = process.env.PORT || 8000;

app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(spotifyRouter.routes());

io.on("connection", (socket) => {
    console.log(socket);
});

app.listen(PORT, () => {
    console.log("🚀 ~ Koa started and listening to", PORT);
});
