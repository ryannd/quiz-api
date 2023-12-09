import { mockPlaylist, mockPlaylistType } from "./mocks/playlist.mock";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { getSpotifyPlaylist } from "../services/spotify.service";
import { SpotifyPlaylist } from "../types/spotify.types";

jest.mock("@spotify/web-api-ts-sdk", () => {
    return {
        SpotifyApi: {
            withClientCredentials: jest.fn().mockReturnThis(),
            playlists: {
                getPlaylist: jest.fn().mockResolvedValue(mockPlaylist),
            },
        },
    };
});

describe("SpotifyService", () => {
    const spotifyApi = SpotifyApi.withClientCredentials("test", "test");
    describe("getPlaylist", () => {
        let playlist: SpotifyPlaylist;

        beforeEach(async () => {
            playlist = await getSpotifyPlaylist("testid");
        });

        it("should use the spotify api to get a playlist", () => {
            expect(spotifyApi.playlists.getPlaylist).toHaveBeenCalledWith(
                "testid",
            );
        });

        it("should process the playlist correctly", () => {
            expect(playlist).toMatchObject(mockPlaylistType);
        });
    });
});
