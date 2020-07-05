import React from "react";
import io from "socket.io-client";

import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

const socket = io(location.origin);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMessage: null,
    };
  }

  _fetchMessage = (messageId: string) => {
    // tslint:disable-next-line: no-console
    console.log(messageId);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <NewMessage socket={socket} />
          </div>
          <div className="col-lg-8">
            <MessageList socket={socket} onMessageClick={this._fetchMessage} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
