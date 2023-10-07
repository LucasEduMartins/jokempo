import { OptionType } from "../model/Option";
import Player from "../model/Player";
import Result from "../model/Result";
import Room from "../model/Room";

export default abstract class CheckResultRoom {
  private static optionsCountToCheckResult = 2;

  static isAllOptionsSelected(room: Room) {
    const SelectedOptionsCount = room.players.reduce((count, player) => {
      return count + (player.option ? +1 : +0);
    }, 0);
    return SelectedOptionsCount == this.optionsCountToCheckResult;
  }

  static checkResult(room: Room): Result | undefined {
    let lastPlayer: Player | undefined = undefined;

    for (const cachedPlayer of room.players) {
      if (lastPlayer != undefined) {
        if (lastPlayer.option == "Papel" && cachedPlayer.option == "Tesoura")
          return { type: "Winner", winner: cachedPlayer };

        if (lastPlayer.option == "Papel" && cachedPlayer.option == "Pedra")
          return { type: "Winner", winner: lastPlayer };

        if (lastPlayer.option == "Papel" && cachedPlayer.option == "Papel")
          return { type: "Draw" };

        if (lastPlayer.option == "Tesoura" && cachedPlayer.option == "Pedra")
          return { type: "Winner", winner: cachedPlayer };

        if (lastPlayer.option == "Tesoura" && cachedPlayer.option == "Papel")
          return { type: "Winner", winner: lastPlayer };

        if (lastPlayer.option == "Tesoura" && cachedPlayer.option == "Tesoura")
          return { type: "Draw" };

        if (lastPlayer.option == "Pedra" && cachedPlayer.option == "Papel")
          return { type: "Winner", winner: cachedPlayer };

        if (lastPlayer.option == "Pedra" && cachedPlayer.option == "Tesoura")
          return { type: "Winner", winner: lastPlayer };

        if (lastPlayer.option == "Pedra" && cachedPlayer.option == "Pedra")
          return { type: "Draw" };
      }

      lastPlayer = cachedPlayer;
    }
    return undefined;
  }
}
