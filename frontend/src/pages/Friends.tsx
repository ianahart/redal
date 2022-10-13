import { Box, Button, Heading, Text, Image } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { MouseEvent, useContext, useState } from 'react';
import { http } from '../helpers/utils';

import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IFriend, IFriendResponse, IUserContext } from '../interfaces';
import { UserContext } from '../context/user';
const Friends = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const navigate = useNavigate();
  const params = useParams();
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchFriends = async (endpoint: string) => {
    try {
      const response = await http.get<IFriendResponse>(endpoint);
      setFriends((prevState) => [...prevState, ...response.data.friends]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchFriends(`/friends/${params.userId}/?page=0`);
  });

  const unFriend = async (e: MouseEvent<HTMLButtonElement>, friend: IFriend) => {
    try {
      e.stopPropagation();
      const filtered = [...friends].filter((f) => f.id !== friend.id);
      setFriends(filtered);
      const response = await http.delete(
        `/friends/${friend.id}/?user=${user.id}&friend=${friend.friend.id}`
      );
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const navigateToMessages = (e: MouseEvent<HTMLButtonElement>, friendId: number) => {
    navigate('/redal/messages/', { state: { userId: user.id, friendId } });
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        m="5rem auto 2rem auto"
        borderRadius="3px"
        bg="blue.secondary"
        minH="600px"
        width={['90%', '90%', '600px']}
      >
        <Box pt="3rem">
          <Heading fontSize="1.5rem" color="text.primary">
            Friends
          </Heading>

          {friends.map((friend) => {
            return (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my="1.5rem"
                bg="blue.tertiary"
                p="0.5rem"
                key={friend.id}
              >
                <Box display="flex" alignItems="center">
                  {friend.friend.avatar_url !== null ? (
                    <Image
                      width="50px"
                      height="50px"
                      borderRadius="50%"
                      src={friend.friend.avatar_url}
                      alt="profile picture"
                    />
                  ) : (
                    <Box
                      width="50px"
                      height="50px"
                      color="#fff"
                      borderRadius="50%"
                      display="flex"
                      bg={friend.friend.color}
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {friend.friend.initials}
                    </Box>
                  )}
                  <RouterLink to={`/redal/profile/${friend.friend.id}`}>
                    <Box>
                      <Text mx="0.5rem" color="text.primary">
                        {friend.friend.first_name} {friend.friend.last_name}
                      </Text>
                    </Box>
                  </RouterLink>
                </Box>

                <Box display="flex">
                  <Box display="flex">
                    <Button
                      onClick={(e) => navigateToMessages(e, friend.friend.id)}
                      mx="0.25rem"
                      type="submit"
                      _hover={{ background: 'text.primary', opacity: 0.8 }}
                      bg="text.primary"
                      color="#fff"
                      width="80%"
                    >
                      Messages
                    </Button>
                  </Box>

                  <Box display="flex">
                    <Button
                      onClick={(e) => unFriend(e, friend)}
                      mx="0.25rem"
                      type="submit"
                      _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                      bg="blue.quatenary"
                      color="#fff"
                      width="80%"
                    >
                      Unfriend
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
          {hasNext && (
            <Box>
              <Button
                onClick={() => fetchFriends(`/friends/${params.userId}/?page=${page}`)}
                mx="0.25rem"
                type="submit"
                _hover={{ background: 'transparent', opacity: 0.8 }}
                bg="transparent"
                color="#fff"
                width="80%"
              >
                See More
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Friends;
