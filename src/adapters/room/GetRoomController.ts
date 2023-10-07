import { Socket } from "socket.io";
import GetAllRooms from "../../core/room/usecases/GetAllRoomsUseCase";
import Room from "../../core/room/model/Room";
import GetRoomUserCase from "../../core/room/usecases/GetRoomUseCase";

export default class GetRoomController {
  constructor(readonly server: Socket, readonly useCase: GetRoomUserCase) {
    server.on("getRoom", async (room: Room) => {
      try {
        const cachedRoom = await useCase.execute(room);
        server.emit("gotRoom", cachedRoom);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
