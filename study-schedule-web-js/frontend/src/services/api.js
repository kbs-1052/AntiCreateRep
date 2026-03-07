import axios from 'axios';

const api = axios.create({
  baseURL: '/api/study',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
