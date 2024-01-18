import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { SpotifyPlaylist, SpotifyTrack } from "../types/spotify.types";

const spotifyApi = SpotifyApi.withClientCredentials(
    process.env.CLIENT_ID || "",
    process.env.CLIENT_SECRET || "",
);

export const getSpotifyPlaylist = async (
    playlistId: string,
): Promise<SpotifyPlaylist | undefined> => {
    try {
        const playlist = await spotifyApi.playlists.getPlaylist(playlistId);
        const filteredTracks: SpotifyTrack[] = [];

        playlist.tracks.items.forEach((item) => {
            const track = item.track;
            if (
                "preview_url" in track &&
                track.preview_url !== "" &&
                track.preview_url !== null
            ) {
                const artists = track.artists.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                }));
                const album = {
                    id: track.album.id,
                    images: track.album.images,
                    name: track.album.name,
                };
                const id = track.id;
                const name = track.name;
                const preview = track.preview_url;

                filteredTracks.push({
                    artists,
                    album,
                    id,
                    name,
                    preview,
                    image: album.images[0],
                });
            }
        });

        return {
            tracks: filteredTracks,
            href: playlist.href,
            description: playlist.description,
            images: playlist.images,
        };
    } catch (e) {
        throw new Error();
    }
};
