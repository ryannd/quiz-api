export type SpotifyPlaylist = {
    tracks: (SpotifyTrack | undefined)[];
    href: string;
    description: string;
    images: SpotifyImage[];
};

export type SpotifyTrack = {
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    id: string;
    name: string;
    preview: string;
    image: SpotifyImage;
};

export type SpotifyArtist = {
    id: string;
    name: string;
};

export type SpotifyAlbum = {
    id: string;
    images: SpotifyImage[];
    name: string;
};

export type SpotifyImage = {
    width: number | null;
    height: number | null;
    url: string;
};
