import {
  Menu,
  Button,
  Portal,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { ChangeEvent, useContext, useState } from 'react';
import { UserContext } from '../../context/user';
import { http } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';

interface ICommentProps {
  postId: number;
  authorId: number;
}

const Comments = ({ postId, authorId }: ICommentProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  const [sort, setSort] = useState('new');
  const [inputValue, setInputValue] = useState('');
  const name = user.display_name
    ? user.display_name
    : user.first_name + ' ' + user.last_name;

  const handleOnTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const addComment = async () => {
    try {
      const response = await http.post('/comments/', {
        user: user.id,
        author: authorId,
        post: postId,
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  return (
    <Box display="flex" mx="2rem" justifyContent="flex-start">
      <Box display="flex" width="100%" flexDir="column">
        <FormLabel color="text.primary" fontSize="0.85rem">
          Commenting as {name}
        </FormLabel>
        <Textarea
          onChange={handleOnTextareaChange}
          value={inputValue}
          width="100%"
        ></Textarea>
        <Box textAlign="left" my="2rem">
          <Menu>
            <MenuButton color="blue.quatenary">Sort by: {sort}</MenuButton>
            <Portal>
              <MenuList>
                <MenuItem onClick={() => setSort('new')}>New</MenuItem>
                <MenuItem onClick={() => setSort('old')}>Old</MenuItem>
                <MenuItem onClick={() => setSort('top')}>Top</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
        <Box textAlign="right">
          <Button
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            width="50%"
          >
            Add comment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Comments;
