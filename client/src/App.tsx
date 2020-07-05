import React from "react";
import io from "socket.io-client";

import MessageList from "./components/MessageList";
import NewMessage from "./components/NewMessage";
import { fetchMessage } from "./api";

const socket = io("http://localhost:8080/");

class App extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      selectedMessage: null,
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <NewMessage socket={socket} />
          </div>
          <div className="col-lg-8">
            <MessageList socket={socket} onMessageClick={fetchMessage} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
