import Room from "../../src/core/room/model/Room";
import CreateRoom from "../../src/core/room/usecases/CreateRoomUseCase";
import ExitRoomUseCase from "../../src/core/room/usecases/ExitRoomUseCase";
import GetAllRooms from "../../src/core/room/usecases/GetAllRoomsUseCase";
import JoinRoom from "../../src/core/room/usecases/JoinRoomUseCase";
import RoomRepositoryMemo from "../../src/externals/memo/RoomRepositoryMemo";
import ReadToPlayUseCase from "../../src/core/room/usecases/ReadyToPlayUseCase";
import Player from "../../src/core/room/model/Player";
import SelectOptionUseCase from "../../src/core/room/usecases/SelectOptionUseCase";
import Result from "../../src/core/room/model/Result";

jest.mock("../../src/externals/memo/RoomRepositoryMemo");
let roomRepository: RoomRepositoryMemo = new RoomRepositoryMemo();

describe("Testing room", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a room ", async () => {
    //Given
    const createRoomUseCase = new CreateRoom(roomRepository);
    const room: Room = { name: "myRoom", players: [] };
    roomRepository.createRoom = jest.fn().mockReturnValue(room);

    //When
    const createdRoom = await createRoomUseCase.execute(room);

    //Then
    expect(createdRoom.name).toBe(room.name);
  });

  it("should get all rooms ", async () => {
    //Given
    const getAllRoomsUseCase = new GetAllRooms(roomRepository);
    const room1 = { name: "myRoom", players: [] };
    const room2 = { name: "myAnotherRoom", players: [] };
    roomRepository.getAll = jest.fn().mockReturnValue([room1, room2]);

    //When
    const allRooms = await getAllRoomsUseCase.execute();

    //Then
    expect(allRooms.length).toBe(2);
  });

  it("should join in the room ", async () => {
    //Given
    const joinRoomUseCase = new JoinRoom(roomRepository);
    const player: Player = { name: "myPlayer" };
    const room: Room = { name: "myRoom", players: [] };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When
    const updatedRoom = await joinRoomUseCase.execute({
      playerName: player.name,
      roomName: room.name,
    });

    //Then
    expect(updatedRoom?.players?.length).toBe(1);
  });

  it("should return a closed room true", async () => {
    //Given
    const joinRoomUseCase = new JoinRoom(roomRepository);
    const player: Player = { name: "myPlayer" };
    const room: Room = { name: "myRoom", players: [player] };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);
    //When
    const updatedRoom = await joinRoomUseCase.execute({
      playerName: player.name,
      roomName: room.name,
    });

    expect(updatedRoom.closed).toBe(true);
  });

  it("should throw full room error when the room is already closed", async () => {
    //Given
    const joinRoomUseCase = new JoinRoom(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };
    const room: Room = {
      name: "myRoom",
      players: [player, player2],
      closed: true,
    };
    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    try {
      //When
      await joinRoomUseCase.execute({
        playerName: player.name,
        roomName: room.name,
      });
    } catch (error) {
      //Then
      expect(error).toEqual(new Error("room is full!"));
    }
  });

  it("should exit the room and return a open room", async () => {
    //Given
    const exitRoomUseCase = new ExitRoomUseCase(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };

    const room: Room = {
      name: "myRoom",
      players: [player, player2],
      closed: true,
    };
    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When

    const updatedRoom = await exitRoomUseCase.execute({
      playerName: player.name,
      roomName: room.name,
    });

    //Then
    expect(updatedRoom.players).toEqual([player2]);
    expect(updatedRoom.closed).toBe(false);
  });

  it("should return a ready player to play the game", async () => {
    //Given
    const readToPlayUseCase = new ReadToPlayUseCase(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };

    const room: Room = {
      name: "myRoom",
      players: [player, player2],
    };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When

    const updatedRoom = await readToPlayUseCase.execute({
      playerName: player.name,
      roomName: room.name,
    });

    //Then
    const result = updatedRoom.players.some((player) => player.ready);
    expect(result).toBe(true);
  });

  it("should select a option game", async () => {
    //Given
    const selectOptionGameUseCase = new SelectOptionUseCase(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };

    const room: Room = {
      name: "myRoom",
      players: [player, player2],
      closed: true,
    };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When
    const updatedRoom = await selectOptionGameUseCase.execute({
      playerName: player.name,
      roomName: room.name,
      optionType: "Pedra",
    });

    //Then
    const result = updatedRoom.players.some((player) => player.option);

    expect(result).toBe(true);
  });

  it("should have a winner", async () => {
    //Given
    const selectOptionGameUseCase = new SelectOptionUseCase(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };

    const room: Room = {
      name: "myRoom",
      players: [player, player2],
      closed: true,
    };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When
    const updatedRoom1 = await selectOptionGameUseCase.execute({
      playerName: player.name,
      roomName: room.name,
      optionType: "Pedra",
    });

    roomRepository.getRoom = jest.fn().mockReturnValue(updatedRoom1);

    const updatedRoom2 = await selectOptionGameUseCase.execute({
      playerName: player2.name,
      roomName: room.name,
      optionType: "Papel",
    });

    //Then
    const result = updatedRoom2.result;
    expect(result?.type).toBe("Winner" as Result["type"]);
    expect(result?.winner).toBe(player2);
  });

  it("should have a draw", async () => {
    //Given
    const selectOptionGameUseCase = new SelectOptionUseCase(roomRepository);
    const player: Player = { name: "myPlayer" };
    const player2: Player = { name: "myPlayer2" };

    const room: Room = {
      name: "myRoom",
      players: [player, player2],
      closed: true,
    };

    roomRepository.getRoom = jest.fn().mockReturnValue(room);

    //When
    const updatedRoom1 = await selectOptionGameUseCase.execute({
      playerName: player.name,
      roomName: room.name,
      optionType: "Pedra",
    });

    roomRepository.getRoom = jest.fn().mockReturnValue(updatedRoom1);

    const updatedRoom2 = await selectOptionGameUseCase.execute({
      playerName: player2.name,
      roomName: room.name,
      optionType: "Pedra",
    });

    //Then
    const result = updatedRoom2.result;
    expect(result?.type).toBe("Draw" as Result["type"]);
    expect(result?.winner).toBe(undefined);
  });
});
