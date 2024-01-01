import io from "..";

export const tick = (room: string, secondsLeft: number) => {
    io.getIo()?.in(room).emit("tick", secondsLeft);
};
