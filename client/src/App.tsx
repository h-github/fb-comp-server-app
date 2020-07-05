import React from "react";
import io from "socket.io-client";

import MessageList from "./components/MessageList";
import NewMessage from "./components/NewMessage";
import MessageDetails from "./components/MessageDetails";
import { fetchMessage } from "./api";
import { IMessage } from "../../src/model/Message";

const socket = io("http://localhost:8080/");

// tslint:disable-next-line: no-empty-interface
interface Props {}
interface State {
  selectedMessage: IMessage | undefined;
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedMessage: undefined,
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <NewMessage socket={socket} />
            {this.state.selectedMessage && (
              <MessageDetails
                message={this.state.selectedMessage}
                handleClick={() =>
                  this.setState({ selectedMessage: undefined })
                }
              />
            )}
          </div>
          <div className="col-lg-8">
            <MessageList
              socket={socket}
              onMessageClick={(messageId: string) => {
                fetchMessage(messageId).then(selectedMessage =>
                  this.setState({ selectedMessage })
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
