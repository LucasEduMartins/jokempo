import Room from "../room/model/Room";

export interface RoomRepository {
  createRoom(room: Room): Promise<Room>;
  getRoom(name: string): Promise<Room | undefined>;
  updateRoom(room: Room): Promise<Room>;
  getAll(): Promise<Room[]>;
}
