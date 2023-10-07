import CreateRoom from "../../core/room/usecases/CreateRoomUseCase";
import Room from "../../core/room/model/Room";
import { SocketType } from "../../core/shared/Socket";

export default class CreateRoomController {
  constructor(readonly server: SocketType, readonly useCase: CreateRoom) {
    server.on("createRoom", async (room: Room) => {
      const { name } = room;
      try {
        const newRoom = await useCase.execute({
          name,
        });
        if (newRoom) {
          server.broadcast.emit("roomCreated", newRoom);
          server.emit("roomCreated", newRoom);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}
