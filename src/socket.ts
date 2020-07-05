import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

// Models
import { IMessage } from "./model/Message";
import Database from "nice-fb-api";

const sendMessage = (socket: Socket | Server) => (message: IMessage) =>
  socket.emit("message", message);

export default (io: Server, db: Database) => {
  const messages: Set<IMessage> = new Set();

  io.on("connection", socket => {
    socket.on("getMessages", () => {
      db.readMany<IMessage>({ collection: "messages" })
        .then(msgs => {
          msgs.forEach(msg => {
            sendMessage(socket)(msg);
            messages.add(msg);
          });
        })
        // tslint:disable-next-line: no-console
        .catch(console.log);
    });

    socket.on("message", (username: string, body: string) => {
      const message: IMessage = {
        id: uuidv4(),
        created: new Date().toUTCString(),
        username,
        body,
      };

      db.write<IMessage>({ collection: "messages", id: message.id }, message);
      messages.add(message);
      sendMessage(io)(message);
    });
  });
};
