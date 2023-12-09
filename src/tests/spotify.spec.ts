import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { getSpotifyPlaylist } from "../services/spotify.service";

jest.mock("@spotify/web-api-ts-sdk", () => ({
    SpotifyApi: {
        withClientCredentials: jest.fn().mockReturnThis(),
        playlists: {
            getPlaylist: jest.fn(),
        },
    },
}));

describe("SpotifyService", () => {
    const spotifyApi = SpotifyApi.withClientCredentials("test", "test");
    describe("getPlaylist", () => {
        it("should use the spotify api to get a playlist", () => {
            getSpotifyPlaylist("testid");
            expect(spotifyApi.playlists.getPlaylist).toHaveBeenCalledWith(
                "testid",
            );
        });
    });
});
