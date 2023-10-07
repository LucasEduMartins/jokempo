import Room from "../../core/room/model/Room";
import { RoomRepository } from "../../core/shared/RoomRepository";

export default class RoomRepositoryMemo implements RoomRepository {
  private rooms: Room[] = [];

  async createRoom(room: Room): Promise<Room> {
    const newRoom = { ...room, id: Math.random() };
    this.rooms.push(newRoom);

    return newRoom;
  }

  async getRoom(name: string): Promise<Room | undefined> {
    const room = this.rooms.find((room) => room.name == name);
    return room;
  }

  async getAll(): Promise<Room[]> {
    return this.rooms;
  }

  async updateRoom(room: Room): Promise<Room> {
    this.rooms = this.rooms.map((cachedRoom) => {
      if (cachedRoom.id === room.id) {
        return { ...cachedRoom, ...room };
      }
      return cachedRoom;
    });

    return room;
  }
}
