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
