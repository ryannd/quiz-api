import Koa from "koa";
import json from "koa-json";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import "dotenv/config";

import { router as spotifyRouter } from "./routes/spotify.route";
import { createServer } from "http";
import io from "./socket";

const app = new Koa();
const PORT = process.env.PORT || 8000;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const httpServer = createServer(app.callback());

io.init(httpServer);

app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(spotifyRouter.routes());

httpServer.listen(PORT, () => {
    console.log("🚀 ~ Koa started and listening to", PORT);
});
