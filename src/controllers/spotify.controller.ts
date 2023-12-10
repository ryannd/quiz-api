import Koa from "koa";
import { getSpotifyPlaylist } from "../services/spotify.service";

export const getPlaylist = async (ctx: Koa.Context) => {
    const playlistId = ctx.params?.id;

    if (!playlistId) {
        ctx.throw(400, {
            error: { code: 400, message: "INVALID_ROUTE_OPTIONS" },
        });
    }

    try {
        const playlist = await getSpotifyPlaylist(playlistId);
        ctx.body = { data: { playlist } };
    } catch (e) {
        ctx.throw(400, { error: { code: 400, message: "INVALID_DATA" } });
    }
};
