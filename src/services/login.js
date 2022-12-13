import axios from 'axios';
import api from './api';

export const requestLogin = data => {
  return axios.post(`${api.USER_SERVICE}/login`, data, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
};

export const requestLogout = (headers, refreshToken) => {
  return axios.post(
    `${api.USER_SERVICE}/users/logout`,
    {
      refreshToken,
    },
    headers,
  );
};

export const requestFetchMe = headers => {
  return axios.get(`${api.USER_SERVICE}/users/me`, {
    headers: headers,
  });
};
