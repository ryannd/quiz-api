import { SpotifyPlaylist } from "./spotify.types";

export type ClientPlayer = {
    id: string;
    name: string;
    score: number;
    answer: string;
    room: string;
    ready: boolean;
};

export type ClientRoom = {
    id: string;
    players: { [id: string]: ClientPlayer };
    hostId: string;
    playlist: SpotifyPlaylist | undefined;
};
