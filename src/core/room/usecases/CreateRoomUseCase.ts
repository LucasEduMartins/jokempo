import UseCase from "../../shared/UseCase";
import Room from "../model/Room";
import { RoomRepository } from "../../shared/RoomRepository";

type InType = {
  name: string;
};

export default class CreateRoom implements UseCase<InType, Room> {
  constructor(private readonly repository: RoomRepository) {}

  async execute(i: InType): Promise<Room> {
    const { name } = i;
    const room = await this.repository.getRoom(name);

    if (room) throw new Error("room name is already in use!");

    const newRoom = await this.repository.createRoom({ name, players: [] });
    return newRoom;
  }
}
