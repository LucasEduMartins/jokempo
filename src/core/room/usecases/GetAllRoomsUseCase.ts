import UseCase from "../../shared/UseCase";
import Room from "../model/Room";
import { RoomRepository } from "../../shared/RoomRepository";

export default class GetAllRooms implements UseCase<null, Room[]> {
  constructor(readonly repository: RoomRepository) {}

  async execute(): Promise<Room[]> {
    const rooms = await this.repository.getAll();
    return rooms;
  }
}
