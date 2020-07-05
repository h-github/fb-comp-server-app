import React from "react";
import moment from "moment";

import { IMessage } from "../../../src/model/Message";

const MessageDetails = ({
  message,
  handleClick,
}: {
  message: IMessage | undefined;
  handleClick: () => void;
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{message?.username}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {message?.created
            ? moment(new Date(message?.created)).format("lll")
            : ""}
        </h6>
        <p className="card-text">{message?.body}</p>
        <p>
          <small>{message?.id}</small>
        </p>
        <button onClick={handleClick} className="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageDetails;
