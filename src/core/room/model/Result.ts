import Player from "./Player";

export default interface Result {
  type: "Draw" | "Winner";
  winner?: Player;
}
