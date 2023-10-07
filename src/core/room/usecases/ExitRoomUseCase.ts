import UseCase from "../../shared/UseCase";
import Room from "../model/Room";
import { RoomRepository } from "../../shared/RoomRepository";

type InputType = {
  roomName: string;
  playerName: string;
};

export default class ExitRoomUseCase implements UseCase<InputType, Room> {
  constructor(private readonly repository: RoomRepository) {}

  async execute(input: InputType): Promise<Room> {
    const { roomName, playerName } = input;
    const cachedRoom = await this.repository.getRoom(roomName);

    if (!cachedRoom) throw new Error("Room doesn't exist!");

    cachedRoom.players = cachedRoom.players.filter(
      (cachedPlayer) => cachedPlayer.name != playerName
    );

    cachedRoom.closed = false;

    const updateRoom: Room = { ...cachedRoom };

    await this.repository.updateRoom(updateRoom);
    return updateRoom;
  }
}
