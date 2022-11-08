import axios from 'axios';
import api from './api';

export const requestLogin = (body) => {
  return axios.post(`${api.USER_SERVICE}/login`, body);
};
