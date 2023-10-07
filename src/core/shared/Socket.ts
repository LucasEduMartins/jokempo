import { Socket } from "socket.io";

export type SocketType = Socket & { username: string };
