import { Box, Input } from '@chakra-ui/react';
import { BsSearch } from 'react-icons/bs';

const Searchbar = () => {
  return (
    <Box position="relative">
      <Input bg="blue.tertiary" border="none" placeholder="Search" paddingLeft="1.7rem" />
      <Box position="absolute" top="10px" left="5px">
        <BsSearch color="#8a8f9d" fontSize="1.2rem" />
      </Box>
    </Box>
  );
};

export default Searchbar;
