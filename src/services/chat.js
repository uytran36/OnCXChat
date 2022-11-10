import axios from 'axios';
import api from './api';

export const requestGetRoomsInfo = (headers, params) => {
  return axios.get(`${api.CHAT_SERVICE}/room`, {
    headers,
    params,
  });
};

export const requestAcceptRoom = (headers, params, data) => {
  return axios.post(`${api.CHAT_SERVICE}/room/approved`, data, {
    headers,
    params,
  });
};

export const requestReadMessage = (headers, params) => {
  return axios.post(`${api.CHAT_SERVICE}/room/read-message`, {
    headers,
    params,
  });
};

export const requestGetRoomInfo = (headers, params) => {
  return axios.get(`${api.CHAT_SERVICE}/room/details/${params?.roomId}`, {
    headers,
  });
};

export const requestGetRoomMessages = (headers, params) => {
  return axios.get(`${api.CHAT_SERVICE}/room/message`, {
    headers,
    params,
  });
};
