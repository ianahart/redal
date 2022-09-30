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

export const parseJWT = (tokens: { access_token: string; refresh_token: string }) => {
  var base64Url = tokens.access_token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload).user_id;
};
