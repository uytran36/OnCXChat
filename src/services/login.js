import axios from 'axios';
import api from './api';

export const requestLogin = data => {
  return axios.post(`${api.USER_SERVICE}/login`, data);
};
