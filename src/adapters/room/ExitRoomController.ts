import ExitRoomUseCase from "../../core/room/usecases/ExitRoomUseCase";
import Room from "../../core/room/model/Room";
import { SocketType } from "../../core/shared/Socket";

export default class ExitRoomController {
  constructor(readonly server: SocketType, readonly useCase: ExitRoomUseCase) {
    server.on("exitRoom", async (room: Room) => {
      try {
        const rooms = await useCase.execute({
          playerName: server.username,
          roomName: room?.name,
        });
        if (rooms) {
          server.broadcast.emit("userExitedRoom", rooms);
          server.emit("exitedRoom", rooms);
          server.leave(room?.name);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}
