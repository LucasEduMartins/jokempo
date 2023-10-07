import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { SocketType } from "./core/shared/Socket";
import CreateRoom from "./core/room/usecases/CreateRoomUseCase";
import CreateRoomController from "./adapters/room/CreateRoomController";
import JoinRoom from "./core/room/usecases/JoinRoomUseCase";
import JoinRoomController from "./adapters/room/JoinRoomController";
import ListRoom from "./core/room/usecases/GetAllRoomsUseCase";
import ListRoomController from "./adapters/room/GetAllRoomsController";
import RoomRepositoryMemo from "./externals/memo/RoomRepositoryMemo";
import ExitRoomUseCase from "./core/room/usecases/ExitRoomUseCase";
import ExitRoomController from "./adapters/room/ExitRoomController";
import ReadToPlayUseCase from "./core/room/usecases/ReadyToPlayUseCase";
import ReadToPlayController from "./adapters/room/ReadToPlayController";
import SelectOptionController from "./adapters/room/SelectOptionController";
import SelectOptionUseCase from "./core/room/usecases/SelectOptionUseCase";
import GetRoomUserCase from "./core/room/usecases/GetRoomUseCase";
import GetRoomController from "./adapters/room/GetRoomController";

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  (socket as any).username = username;

  next();
});

const roomRepository = new RoomRepositoryMemo();

const createRoomUseCase = new CreateRoom(roomRepository);
const joinRoomUseCase = new JoinRoom(roomRepository);
const listRoomUseCase = new ListRoom(roomRepository);
const exitRoomUseCase = new ExitRoomUseCase(roomRepository);
const readToPlayUseCase = new ReadToPlayUseCase(roomRepository);
const selectOptionUseCase = new SelectOptionUseCase(roomRepository);
const getRoomUserCase = new GetRoomUserCase(roomRepository);

io.on("connection", (socket) => {
  // Room controllers
  new CreateRoomController(socket as SocketType, createRoomUseCase);
  new JoinRoomController(socket as SocketType, joinRoomUseCase);
  new ListRoomController(socket as SocketType, listRoomUseCase);
  new ExitRoomController(socket as SocketType, exitRoomUseCase);
  new ReadToPlayController(socket as SocketType, readToPlayUseCase);
  new SelectOptionController(socket as SocketType, selectOptionUseCase);
  new GetRoomController(socket as SocketType, getRoomUserCase);

  console.log((socket as any).username + " user connected");

  socket.on("disconnect", async () => {
    console.log(`user ${(socket as SocketType).username} as disconnect`);
  });

  // delete this
  socket.onAny((data) => {
    console.log("event:", data);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
