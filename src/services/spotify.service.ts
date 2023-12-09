import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.CLIENT_ID || "",
    process.env.CLIENT_SECRET || "",
);

export const getSpotifyPlaylist = async (playlistId: string) => {
    return await spotifyApi.playlists.getPlaylist(playlistId);
};
