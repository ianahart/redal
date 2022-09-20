import axios from 'axios';
export const http = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

export const retreiveTokens = () => {
  const storage = localStorage.getItem('tokens');
  let tokens;
  if (storage) {
    tokens = JSON.parse(storage);
  }
  return tokens;
};
