import express from "express";
import http from "http";
import cors from "cors";

// import Bundler from "parcel-bundler";
// import path from "path";
import SocketIOServer from "socket.io";
import initializeSocketIO from "./socket";
import initializeFirebase from "./firebase";
import { IMessage } from "./model/Message";

const app = express();
const server = new http.Server(app);
const io = SocketIOServer(server);
const port = process.env.PORT || 8080;

// const bundler = new Bundler(path.join(__dirname, "../src/client/index.html"));

const db = initializeFirebase();
initializeSocketIO(io, db);

app.get("/api/messages/:messageId", cors(), (req, res) => {
  db.readOne<IMessage>({
    collection: "messages",
    id: req.params.messageId,
  }).then((msg: IMessage) => {
    res.status(200).send(msg);
  });
});

// app.use(bundler.middleware());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

server.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`server started at http://localhost:${port}`);
});
