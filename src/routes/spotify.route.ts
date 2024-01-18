import Router from "@koa/router";
import { getPlaylist } from "../controllers/spotify.controller";

export const router = new Router({
    prefix: "/spotify",
});

router.get("/playlist/:id", getPlaylist);
