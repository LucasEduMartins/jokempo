import UseCase from "../../shared/UseCase";
import Room from "../model/Room";
import { RoomRepository } from "../../shared/RoomRepository";

type InType = {
  playerName: string;
  roomName: string;
};

export default class ReadToPlayUseCase implements UseCase<InType, Room> {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(i: InType): Promise<Room> {
    const { playerName, roomName } = i;
    const room = await this.roomRepository.getRoom(roomName);

    if (!room) throw new Error("room doesn't exist!");

    const myPlayer = room?.players.find(
      (cachedPlayer) => cachedPlayer.name == playerName
    );
    myPlayer!.ready = true;

    await this.roomRepository.updateRoom(room);

    return room;
  }
}
