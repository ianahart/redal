import { Box, ListItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineLock, AiOutlineUserAdd } from 'react-icons/ai';
const MobileListItems = () => {
  return (
    <>
      <ListItem
        _hover={{ background: '#1e293b' }}
        py="0.5rem"
        pl="0.25rem"
        color="#fff"
        m="0.5rem 0"
      >
        <Box display="flex" alignItems="center">
          <Box mr="0.25rem">
            <AiOutlineHome />
          </Box>
          <RouterLink to="/">Home</RouterLink>
        </Box>
      </ListItem>
      <ListItem
        _hover={{ background: '#1e293b' }}
        py="0.5rem"
        pl="0.25rem"
        color="#fff"
        m="0.5rem 0"
      >
        <Box display="flex" alignItems="center">
          <Box mr="0.25rem">
            <AiOutlineUserAdd />
          </Box>
          <RouterLink to="/sign-up">Create Account</RouterLink>
        </Box>
      </ListItem>
      <ListItem
        _hover={{ background: '#1e293b' }}
        py="0.5rem"
        pl="0.25rem"
        color="#fff"
        m="0.5rem 0 "
      >
        <Box display="flex" alignItems="center">
          <Box mr="0.25rem">
            <AiOutlineLock />
          </Box>
          <RouterLink to="/login">Login</RouterLink>
        </Box>
      </ListItem>
    </>
  );
};

export default MobileListItems;
