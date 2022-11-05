import axios from 'axios';
import api from './api';

export const requestGetRoomsInfo = params => {
  return axios.get(`${api.CHAT_SERVICE}/room`, {
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbImFkbWluIl0sInNlc3Npb25JZCI6IjU4YmYwNDU0LTkxMDgtNGYwZi05OGE3LWVkNWFmNTRjMmRhYyIsImlhdCI6MTY2NzU0NzE0MCwiZXhwIjoxNjY3NjMzNTQwfQ.UQRg1iHiMmXl8rgXwkRWqZHLS3RF2QRjhqA_cEwzihUM-kravqFOxew0KWXvG5nyvznAU3Uq1tvob_JBEHkOug',
      userId: '6131c12466eaf19ca7a2daff',
    },
    params,
  });
};
