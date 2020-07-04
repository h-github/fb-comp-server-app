import { Map } from "immutable";
import React, { SyntheticEvent, useEffect, useState } from "react";
import moment from "moment";

import "../styles/MessageList.scss";

import { IMessage } from "../../model/Message";

const MessageList = ({ socket }) => {
  const [messages, setMessages] = useState(Map());

  useEffect(() => {
    const messageListener = (message: IMessage) => {
      setMessages(prevMessages => prevMessages.set(message.id, message));
    };

    const deleteMessageListener = (messageID: string) => {
      setMessages(prevMessages => prevMessages.delete(messageID));
    };

    socket.on("message", messageListener);
    socket.on("deleteMessage", deleteMessageListener);
    socket.emit("getMessages");

    return () => {
      socket.off("message", messageListener);
      socket.off("deleteMessage", deleteMessageListener);
    };
  }, [socket]);

  return (
    <div className="message-list">
      {messages
        .toSet()
        .sortBy((message: IMessage) => message.time)
        .map((message: IMessage) => (
          <div
            key={message.id}
            className="message-list--message-container row no-margin"
            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
          >
            <span className="message-list--user col-lg-3">{`${message.username}: `}</span>
            <div className="message-list--message no-padding col-lg-9">
              <span className="message-body">{message.body}</span>
              <span className="message-date">
                {moment(message.time).calendar()}
              </span>
            </div>
          </div>
        ))
        .toArray()}
    </div>
  );
};

export default MessageList;
