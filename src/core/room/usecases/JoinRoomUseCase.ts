import UseCase from "../../shared/UseCase";
import Player from "../model/Player";
import Room from "../model/Room";
import CheckRoomLength from "../services/CheckFullRoom";
import { RoomRepository } from "../../shared/RoomRepository";

type InType = {
  playerName: string;
  roomName: string;
};

export default class JoinRoom implements UseCase<InType, Room> {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(i: InType): Promise<Room> {
    const { playerName, roomName } = i;
    const room = await this.roomRepository.getRoom(roomName);

    if (!room) throw new Error("room doesn't exist!");
    // if (room?.closed) throw new Error("room is full!");

    const player: Player = { name: playerName };
    room?.players!.push(player);

    room.closed = CheckRoomLength.isFull(room);

    await this.roomRepository.updateRoom(room);

    return room;
  }
}
