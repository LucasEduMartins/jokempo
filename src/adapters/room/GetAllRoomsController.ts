import { Socket } from "socket.io";
import GetAllRooms from "../../core/room/usecases/GetAllRoomsUseCase";

export default class GetAllRoomsController {
  constructor(readonly server: Socket, readonly useCase: GetAllRooms) {
    server.on("getAllRooms", async () => {
      try {
        const rooms = await useCase.execute();
        if (!!rooms) server.emit("AllRoomsGot", rooms);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
