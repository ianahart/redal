import { useMemo, useEffect, useState } from 'react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { http, retreiveTokens } from './utils';
import { UserContext } from '../context/user';
import { ITokens, IUserContext } from '../interfaces';

interface IProps {
  children: JSX.Element;
}

const WithAxios: React.FC<IProps> = ({ children }): JSX.Element => {
  const navigate = useNavigate();
  const [isLoaded, setLoaded] = useState(false);
  const { logout, setTokens } = useContext(UserContext) as IUserContext;
  useMemo(() => {
    const reqInterceptorId = http.interceptors.request.use(
      (config) => {
        if (retreiveTokens()?.access_token) {
          // @ts-ignore
          config.headers.Authorization = `Bearer ${retreiveTokens()?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptorId = http.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        const originalRequest = error.config;
        const notAuthenticated =
          error.response?.data?.code === 'bad_authorization_header' ||
          error.response?.data?.detail?.toLowerCase() ===
            'authentication credentials were not provided.';
        if (error.response?.status === 401 && notAuthenticated) {
          setLoaded(true);
        } else if (
          error.response?.status === 401 &&
          error.response?.data?.dir === 'no refresh'
        ) {
          setLoaded(true);
        } else if (
          error.response.status === 401 &&
          originalRequest.url.includes('auth/refresh/')
        ) {
          return Promise.reject(error);
        } else if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storage = retreiveTokens();
          if (storage?.refresh_token) {
            const response = await http.post(`auth/refresh/`, {
              refresh: storage.refresh_token,
            });

            const access_token: string = response.data.access;
            const tokens = retreiveTokens();
            tokens.access_token = access_token;
            localStorage.setItem('tokens', JSON.stringify(tokens));

            //@ts-ignore
            setTokens((prevState: ITokens) => ({
              ...prevState,
              access_token,
            }));
            return http(originalRequest);
          }
        }
        if (error.response.status === 403 || error.response.status === 401) {
          logout();
          if (!isLoaded) {
            setLoaded(true);
          }
          return;
        }
        return Promise.reject(error);
      }
    );
    return () => {
      http.interceptors.response.eject(resInterceptorId);
      http.interceptors.request.eject(reqInterceptorId);
    };
  }, [logout, setTokens, isLoaded, setLoaded]);
  useEffect(() => {
    if (isLoaded) {
      console.log('Are you running? You shouldnt be... WithAxios.tsx');
      navigate('/login');
      setLoaded(false);
    }
  }, [navigate, isLoaded]);

  return children;
};

export default WithAxios;
