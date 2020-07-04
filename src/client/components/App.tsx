import React from "react";
import io from "socket.io-client";

import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

const socket = io(location.origin);

export default () => (
  <div className="container">
    <div className="row">
      <div className="col-lg-4">
        <NewMessage socket={socket} />
      </div>
      <div className="col-lg-8">
        <MessageList socket={socket} />
      </div>
    </div>
  </div>
);
