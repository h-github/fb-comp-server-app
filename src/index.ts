import express from "express";
import http from "http";
import Bundler from "parcel-bundler";
import path from "path";
import SocketIOServer from "socket.io";
import initializeSocketIO from "./socket";
import initializeFirebase from "./firebase";

const app = express();
const server = new http.Server(app);
const io = SocketIOServer(server);
const port = 8080 || process.env.PORT;

const bundler = new Bundler(path.join(__dirname, "../src/client/index.html"));

const db = initializeFirebase();
initializeSocketIO(io, db);
app.use(bundler.middleware());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

server.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log(`server started at http://localhost:${port}`);
});
