import { OptionType } from "../../core/room/model/Option";
import Room from "../../core/room/model/Room";
import SelectOptionUseCase from "../../core/room/usecases/SelectOptionUseCase";
import { SocketType } from "../../core/shared/Socket";

export default class SelectOptionController {
  constructor(
    readonly server: SocketType,
    readonly useCase: SelectOptionUseCase
  ) {
    server.on("selectOption", async (room: Room, option: OptionType) => {
      const { name } = room;
      const updatedRoom = await useCase.execute({
        playerName: server.username,
        roomName: name,
        optionType: option,
      });

      server.to(name).emit("userSelectedOption", {
        room: updatedRoom,
        player: { name: server.username },
      });
      server.emit("selectedOption");
    });
  }
}
