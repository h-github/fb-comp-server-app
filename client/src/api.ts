// import axios, { AxiosResponse } from "axios";
// import { IMessage } from "../../src/model/Message";

export const fetchMessage = (messageId: string) => {
  // return axios
  //   .get<IMessage, AxiosResponse<IMessage>>(
  //     `http://localhost:8080/api/messages/${messageId}`,
  //     { headers: { "Access-Control-Allow-Origin": "http://localhost:3000" } }
  //   )
  //   .then(resp => resp.data);

  return fetch(`http://localhost:8080/api/messages/${messageId}`, {
    mode: "cors",
  }).then(response => response.json());
};
