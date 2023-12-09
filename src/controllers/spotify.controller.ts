import Koa from "koa";
import { getSpotifyPlaylist } from "../services/spotify.service";

export const getPlaylist = async (ctx: Koa.Context) => {
    const playlistId = ctx.params.id;

    if (!playlistId) {
        ctx.throw(400, "INVALID_ROUTE_OPTIONS");
    }

    const playlist = await getSpotifyPlaylist(playlistId);

    try {
        ctx.body = { data: { playlist } };
    } catch (e) {
        console.error(e);
        ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
    }
};
