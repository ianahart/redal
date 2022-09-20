import React, { useCallback, useContext } from 'react';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import { http, retreiveTokens } from './helpers/utils';
import { IUserContext } from './interfaces';
import { UserContext } from './context/user';
import { useEffectOnce } from './hooks/UseEffectOnce';
import Redal from './pages/Redal';
import RequireGuest from './components/Mixed/RequireGuest';
import RequireAuth from './components/Mixed/RequireAuth';
import WithAxios from './helpers/WithAxios';
import AuthNavbar from './components/Navbar/AuthNavbar';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  const { setUser, user } = useContext(UserContext) as IUserContext;

  const storeUser = useCallback(async () => {
    try {
      const tokens = retreiveTokens();
      const response = await http.get('/account/refresh/', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      setUser(response.data.user);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  }, [setUser]);

  useEffectOnce(() => {
    storeUser();
  });

  return (
    <ChakraProvider theme={theme}>
      <Box background="blue.primary" className="App">
        <Router>
          {user.logged_in ? <AuthNavbar /> : <Navbar />}
          <WithAxios>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireGuest>
                    <Home />
                  </RequireGuest>
                }
              />
              <Route
                path="/redal"
                element={
                  <RequireAuth>
                    <Redal />
                  </RequireAuth>
                }
              />

              <Route
                path="/redal/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />

              <Route
                path="/redal/settings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />

              <Route
                path="/sign-up"
                element={
                  <RequireGuest>
                    <CreateAccount />
                  </RequireGuest>
                }
              />
              <Route
                path="/login"
                element={
                  <RequireGuest>
                    <Login />
                  </RequireGuest>
                }
              />
            </Routes>
          </WithAxios>
        </Router>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
