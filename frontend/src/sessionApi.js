import axios from 'axios';

const sessionApi = axios.create({
  baseURL: 'http://localhost:8000', // was 127.0.0.1
  withCredentials: true,
  withXSRFToken: true,
});

export default sessionApi;
