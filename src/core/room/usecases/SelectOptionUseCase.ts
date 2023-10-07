import UseCase from "../../shared/UseCase";
import { OptionType } from "../model/Option";
import Player from "../model/Player";
import Room from "../model/Room";
import CheckResultRoom from "../services/CheckResultRoom";
import { RoomRepository } from "../../shared/RoomRepository";

type InType = {
  playerName: string;
  optionType: OptionType;
  roomName: string;
};

export default class SelectOptionUseCase implements UseCase<InType, Room> {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(i: InType): Promise<Room> {
    const { playerName, roomName, optionType } = i;
    const room = await this.roomRepository.getRoom(roomName);

    if (!room) throw new Error("room doesn't exist!");

    const myPlayer = room?.players.find(
      (cachedPlayer) => cachedPlayer.name == playerName
    );

    myPlayer!.option = optionType;

    if (CheckResultRoom.isAllOptionsSelected(room)) {
      room.result = CheckResultRoom.checkResult(room);
    }

    await this.roomRepository.updateRoom(room);

    return room;
  }
}
