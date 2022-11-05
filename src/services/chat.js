import axios from 'axios';
import api from './api';

export const requestGetRoomsInfo = (headers, params) => {
  return axios.get(`${api.CHAT_SERVICE}/room`, {
    headers,
    params,
  });
};
