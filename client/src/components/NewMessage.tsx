import React, { SyntheticEvent } from "react";

interface IProps {
  socket: SocketIOClient.Socket;
}

interface IState {
  username: string;
  body: string;
}
class NewMessage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      username: "",
      body: "",
    };
  }

  _submitForm = (e: SyntheticEvent) => {
    e.preventDefault();
    const { body, username } = this.state;
    this.props.socket.emit("message", username, body);
    this.setState({ body: "" });
  };

  render() {
    return (
      <div className="jumbotron">
        <form onSubmit={this._submitForm}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-control"
              value={this.state.username}
              onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                this.setState({ username: e.currentTarget.value });
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              autoFocus
              value={this.state.body}
              rows={5}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                this.setState({ body: e.currentTarget.value })
              }
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    );
  }
}

export default NewMessage;
