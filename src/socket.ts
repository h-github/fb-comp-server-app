import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import Database from "nice-fb-api";

// Models
import { IMessage } from "./model/Message";
import { IDatabaseSetting } from "nice-fb-api/lib/types/databaseSetting";

const sendMessage = (socket: Socket | Server) => (message: IMessage) =>
  socket.emit("message", message);

const dbSetting: IDatabaseSetting = {
  project_id: "testproject-835d8",
  api_key: "AIzaSyDbAQY8fU8WrzGhdXi1gPGR9jIwImXXASE",
  cache_max_age: 20000,
  cache_allocated_memory: 50,
};

const db = new Database(dbSetting);

// The default cache size threshold is 40 MB. Configure "cacheSizeBytes"
// for a different threshold (minimum 1 MB) or set to "CACHE_SIZE_UNLIMITED"
// to disable clean-up.
db.firestore.settings({
  cacheSizeBytes: 500000000,
});

db.firestore.enablePersistence().catch(err => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.

    // tslint:disable-next-line: no-console
    console.error("failed-precondition", err);
  } else if (err.code === "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence

    // tslint:disable-next-line: no-console
    console.error("unimplemented", err);
  }
});

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
