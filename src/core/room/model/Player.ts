import { OptionType } from "./Option";

export default interface Player {
  name: string;
  ready?: boolean;
  option?: OptionType;
}
