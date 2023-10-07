import Player from "./Player";
import Result from "./Result";

export default interface Room {
  id?: number;
  name: string;
  players: Player[];
  closed?: boolean;
  result?: Result;
}
