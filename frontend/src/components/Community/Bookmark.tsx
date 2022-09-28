import { Box, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { http } from '../../helpers/utils';

interface IBookmarkProps {
  postId: number;
  userId: number;
  userBookmarked: boolean;
  bookmarkId: number;
  updateBookmark: (action: string) => void;
}

const Bookmark = ({
  postId,
  userId,
  userBookmarked,
  bookmarkId,
  updateBookmark,
}: IBookmarkProps) => {
  const addBookmark = async () => {
    try {
      updateBookmark('add');
      const response = await http.post('/bookmarks/', {
        post: postId,
        user: userId,
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const removeBookmark = async () => {
    try {
      updateBookmark('delete');
      await http.delete(`/bookmarks/${postId}/?user_id=${userId}`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  return (
    <Box cursor="pointer" alignItems="center" mx="1rem" display="flex">
      {userBookmarked ? (
        <Box onClick={removeBookmark}>
          <BsBookmarkFill color="orange" />
        </Box>
      ) : (
        <Box onClick={addBookmark}>
          <BsBookmark color="#8a8f9d" fontSize="1rem" />
        </Box>
      )}
      <Text color="text.primary" ml="0.5rem" role="button" cursor="pointer">
        {userBookmarked ? 'Unsave' : 'Save'}
      </Text>
    </Box>
  );
};
export default Bookmark;
