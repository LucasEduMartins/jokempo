import Room from "../../core/room/model/Room";
import ReadToPlayUseCase from "../../core/room/usecases/ReadyToPlayUseCase";
import { SocketType } from "../../core/shared/Socket";

export default class ReadToPlayController {
  constructor(
    readonly server: SocketType,
    readonly useCase: ReadToPlayUseCase
  ) {
    server.on("readToPlay", async (room: Room) => {
      const { name } = room;
      await useCase.execute({ playerName: server.username, roomName: name });

      server.to(name).emit("userReadToPlay", { name });
      server.emit("readedToPlay", { name });
    });
  }
}
