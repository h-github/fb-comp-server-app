import { Map } from "immutable";
import React, { useEffect, useState } from "react";
import moment from "moment";

import "../styles/MessageList.scss";
import { IMessage } from "../../../src/model/Message";

const MessageList = ({
  socket,
  onMessageClick,
}: {
  socket: SocketIOClient.Socket;
  onMessageClick: (id: string) => void;
}) => {
  const [messages, setMessages] = useState(Map<string, IMessage>());

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
        .sortBy<Date>((message: IMessage) => new Date(message.created))
        .map((message: IMessage) => (
          <div
            key={message.id}
            className="message-list--message-container row no-margin"
            title={`Sent at ${new Date(message.created).toLocaleTimeString()}`}
          >
            <span className="message-list--user col-lg-3">{`${message.username}: `}</span>
            <div className="message-list--message no-padding col-lg-9">
              <span
                className="message-body"
                onClick={e => {
                  e.preventDefault();
                  onMessageClick(message.id);
                }}
              >
                {message.body}
              </span>
              <span className="message-date">
                {moment(new Date(message.created)).format("lll")}
              </span>
            </div>
          </div>
        ))
        .toArray()}
    </div>
  );
};

export default MessageList;
