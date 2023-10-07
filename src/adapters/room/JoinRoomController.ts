import Room from "../../core/room/model/Room";
import JoinRoom from "../../core/room/usecases/JoinRoomUseCase";
import { SocketType } from "../../core/shared/Socket";

export default class JoinRoomController {
  constructor(readonly server: SocketType, readonly useCase: JoinRoom) {
    server.on("joinRoom", async (room: Room) => {
      const { name } = room;
      await useCase.execute({ playerName: server.username, roomName: name });

      server.join(name);
      server.to(name).emit("userEnteredRoom", { name: server.username });
      server.emit("joinedRoom", { name });
    });
  }
}
