import React from 'react';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import theme from './theme/theme';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box background="blue.primary" className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
