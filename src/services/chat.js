import axios from 'axios';
import api from './api';

export const requestGetRoomsInfo = params => {
  return axios.get(`${api.CHAT_SERVICE}/room`, {
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbImFkbWluIl0sInNlc3Npb25JZCI6IjlhMWJkYTBkLTQyYTctNGViMS1iN2ZiLThlZGY4OTIyOGUyMiIsImlhdCI6MTY2NzExODA1NywiZXhwIjoxNjY3MjA0NDU3fQ.lb3lXIrZPPDPBOOWFGsBmsyyfZt-Z7nNhvKJifBz_eACjJvF0dN_Eej1APAAUcIq5_kO9elhTF2xW293B1uZ1g',
      userId: '6131c12466eaf19ca7a2daff',
    },
    params,
  });
};
