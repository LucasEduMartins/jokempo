import Room from "../model/Room";

export default abstract class CheckRoomLength {
  private static maxRoomLength = 2;

  static isFull(room: Room) {
    return room.players.length == this.maxRoomLength;
  }
}
