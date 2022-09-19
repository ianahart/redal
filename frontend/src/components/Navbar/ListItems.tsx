import { ListItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ListItems = () => {
  return (
    <>
      <ListItem color="#fff" m="1rem">
        <RouterLink to="/">Home</RouterLink>
      </ListItem>
      <ListItem color="#fff" m="1rem">
        <RouterLink to="/sign-up">Create Account</RouterLink>
      </ListItem>
      <ListItem color="#fff" m="1rem">
        <RouterLink to="/login">Login</RouterLink>
      </ListItem>
    </>
  );
};

export default ListItems;
