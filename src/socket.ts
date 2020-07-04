import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// Models
import { IMessage } from "./model/Message";

const messageExpirationTimeMS = 10 * 1000;

const sendMessage = (socket: Socket | Server) => (message: IMessage) =>
  socket.emit("message", message);

export default (io: Server) => {
  const messages: Set<IMessage> = new Set();

  io.on("connection", socket => {
    socket.on("getMessages", () => {
      messages.forEach(sendMessage(socket));
    });

    socket.on("message", (username: string, body: string) => {
      const message: IMessage = {
        id: uuidv4(),
        time: new Date(),
        username,
        body,
      };

      messages.add(message);

      sendMessage(io)(message);
    });
  });
};
