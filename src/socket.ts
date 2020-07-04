import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import Database from "nice-fb-api";

// Models
import { IMessage } from "./model/Message";
import { IDatabaseSetting } from "nice-fb-api/lib/types/databaseSetting";

const messageExpirationTimeMS = 10 * 1000;

const sendMessage = (socket: Socket | Server) => (message: IMessage) =>
  socket.emit("message", message);

// tslint:disable-next-line: no-var-requires
const serviceAccountKey = require("./service_account_key_path.json");
const dbSetting: IDatabaseSetting = {
  project_id: "testproject-835d8",
  service_account_key: serviceAccountKey,
  cache_max_age: 20000,
  cache_allocated_memory: 50,
};

const db = new Database(dbSetting);

export default (io: Server) => {
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
        time: new Date(),
        username,
        body,
      };

      db.write<IMessage>({ collection: "messages", id: message.id }, message);
      messages.add(message);
      sendMessage(io)(message);
    });
  });
};
