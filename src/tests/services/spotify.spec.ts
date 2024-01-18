import { mockPlaylist, mockPlaylistType } from "../mocks/playlist.mock";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import * as spotifyService from "../../services/spotify.service";
import { SpotifyPlaylist } from "../../types/spotify.types";
import { createMockContext } from "@shopify/jest-koa-mocks";
import { getPlaylist } from "../../controllers/spotify.controller";
import { RouterContext } from "koa-router";

jest.mock("@spotify/web-api-ts-sdk", () => {
    return {
        SpotifyApi: {
            withClientCredentials: jest.fn().mockReturnThis(),
            playlists: {
                getPlaylist: jest.fn(),
            },
        },
    };
});

describe("SpotifyService", () => {
    const spotifyApi = SpotifyApi.withClientCredentials("test", "test");
    describe("getSpotifyPlaylist", () => {
        let playlist: SpotifyPlaylist | undefined;
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.clearAllMocks();
        });

        it("should throw if spotify call fails", () => {
            spotifyApi.playlists.getPlaylist = jest.fn().mockRejectedValue({});
            return expect(async () => {
                await spotifyService.getSpotifyPlaylist("testid");
            }).rejects.toThrow();
        });

        it("should process the playlist correctly", async () => {
            spotifyApi.playlists.getPlaylist = jest
                .fn()
                .mockResolvedValue(mockPlaylist);
            playlist = await spotifyService.getSpotifyPlaylist("testid");
            expect(playlist).toMatchObject(mockPlaylistType);
        });

        it("should use the spotify api to get a playlist", async () => {
            const getPlaylistSpy = jest.spyOn(
                spotifyApi.playlists,
                "getPlaylist",
            );
            await spotifyService.getSpotifyPlaylist("testid");
            expect(getPlaylistSpy).toHaveBeenCalledWith("testid");
        });
    });
});

describe("SpotifyController", () => {
    describe("getPlaylist", () => {
        it("throws if no playlist id", async () => {
            const ctx = createMockContext({
                customProperties: { params: { id: "" } },
            }) as RouterContext;
            await getPlaylist(ctx);
            expect(ctx.throw).toHaveBeenCalledWith(400, {
                error: { code: 400, message: "INVALID_ROUTE_OPTIONS" },
            });
        });

        it("calls spotify service", async () => {
            const getSpy = jest.spyOn(spotifyService, "getSpotifyPlaylist");
            const ctx = createMockContext({
                customProperties: { params: { id: "12345" } },
            }) as RouterContext;
            await getPlaylist(ctx);
            expect(getSpy).toHaveBeenCalledWith("12345");
        });

        it("throws if service call fails", async () => {
            jest.spyOn(spotifyService, "getSpotifyPlaylist").mockRejectedValue(
                {},
            );
            const ctx = createMockContext({
                customProperties: { params: { id: "12345" } },
            }) as RouterContext;
            await getPlaylist(ctx);
            expect(ctx.throw).toHaveBeenCalledWith(400, {
                error: { code: 400, message: "INVALID_DATA" },
            });
        });
    });
});
