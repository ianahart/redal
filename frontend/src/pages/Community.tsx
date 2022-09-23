import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const AuthorCommunity = () => {
  const location = useLocation();
  console.log(location);
  return <Box minH="100vh">Author Community</Box>;
};

export default AuthorCommunity;
