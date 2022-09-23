import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserContextProvider from './context/user';
import CommunityContextProvider from './context/community';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CommunityContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </CommunityContextProvider>
  </React.StrictMode>
);
