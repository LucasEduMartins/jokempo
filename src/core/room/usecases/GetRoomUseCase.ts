import UseCase from "../../shared/UseCase";
import Room from "../model/Room";
import { RoomRepository } from "../../shared/RoomRepository";

export default class GetRoomUserCase implements UseCase<Room, Room> {
  constructor(readonly repository: RoomRepository) {}

  async execute(room: Room): Promise<Room> {
    const myRoom = await this.repository.getRoom(room?.name);
    if (!myRoom) throw new Error("Room doesn't exist!");

    return myRoom;
  }
}
