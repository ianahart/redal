import { Box, Button, Text } from '@chakra-ui/react';
import { BsBookmarkFill } from 'react-icons/bs';
import { Link as RouterLink } from 'react-router-dom';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IFullBookmark, IRetrieveBookmarkResponse } from '../interfaces';

import { useState } from 'react';
import { http } from '../helpers/utils';
import { Axios, AxiosError } from 'axios';
const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<IFullBookmark[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);

  const fetchBookmarks = async (endpoint: string) => {
    try {
      const response = await http.get<IRetrieveBookmarkResponse>(endpoint);
      setBookmarks((prevState) => [...prevState, ...response.data.bookmarks]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const removeBookmark = async (bookmarkId: number) => {
    try {
      const filtered = bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
      setBookmarks(filtered);
      await http.delete(`/bookmarks/${bookmarkId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchBookmarks('/bookmarks/?page=0');
  });
  return (
    <Box minH="100vh">
      <Box
        minH="500px"
        bg="blue.secondary"
        borderRadius="3px"
        width={['90%', '90%', '600px']}
        m="5rem auto 2rem auto"
      >
        <Box display="flex" justifyContent="flex-start" m="1rem" pt="3rem">
          <Text
            color="text.primary"
            borderBottom="1px solid"
            textAlign="left"
            width={['90%', '90%', '550px']}
            borderColor="text.primary"
            pb="0.25rem"
            textTransform="uppercase"
          >
            Bookmarks
          </Text>
        </Box>
        <Box my="2rem">
          {bookmarks.length <= 0 ? (
            <Box>
              <Text>You currently do not have any saved posts.</Text>
            </Box>
          ) : (
            <Box p="1rem">
              {bookmarks.map((bookmark) => {
                return (
                  <Box
                    display="flex"
                    bg="#fff"
                    my="1rem"
                    borderRadius="8px"
                    padding="1rem"
                    justifyContent="space-between"
                    alignItems="center"
                    key={bookmark.id}
                  >
                    <RouterLink to={`/redal/posts/${bookmark.post.id}`}>
                      <Text color="text.primary">{bookmark.post.title}</Text>
                    </RouterLink>
                    <Box cursor="pointer" onClick={() => removeBookmark(bookmark.id)}>
                      <BsBookmarkFill color="orange" />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
          {hasNext && (
            <Box>
              <Button
                onClick={() => fetchBookmarks(`/bookmarks/?page=${page}`)}
                _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                bg="blue.quatenary"
                color="#fff"
                width="80%"
                margin="0 auto"
              >
                See more
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Bookmarks;
