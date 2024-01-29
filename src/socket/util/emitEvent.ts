import io from "../";

// todo: standardize type
export default function emitEvent(
    roomCode: string,
    eventString: string,
    data: unknown = {},
) {
    io.getIo()?.in(roomCode).emit(eventString, data);
}
