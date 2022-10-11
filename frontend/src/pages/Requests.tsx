import { Box, Text, Button, Image, Heading } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { MouseEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IRequestResponse, IRequest } from '../interfaces';

const Requests = () => {
  const params = useParams();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchRequests = async (endpoint: string) => {
    try {
      const response = await http.get<IRequestResponse>(endpoint);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
      setRequests((prevState) => [...prevState, ...response.data.requests]);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    fetchRequests(`/friends/requests/${params.userId}/?page=0`);
  });

  const ignoreRequest = async (e: MouseEvent, id: number) => {
    try {
      e.stopPropagation();
      const filtered = [...requests].filter((request) => request.id !== id);
      setRequests(filtered);
      const response = await http.delete(`/friends/requests/${id}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const acceptRequest = async (
    e: MouseEvent<HTMLButtonElement>,
    requestId: number,
    fromUser: number,
    toUser: number
  ) => {
    try {
      const filtered = [...requests].filter((request) => request.id !== requestId);
      setRequests(filtered);

      const response = await http.post('/friends/', {
        user: toUser,
        friend: fromUser,
        id: requestId,
      });
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        bg="blue.secondary"
        width={['90%', '90%', '600px']}
        minH="600px"
        borderRadius="3px"
        margin="5rem auto 2rem auto"
      >
        <Box pt="3rem">
          <Heading fontSize="1.5rem" color="text.primary">
            Friend Requests
          </Heading>
        </Box>

        {requests.length > 0 ? (
          <Box mt="3rem" className="friendRequestContainer">
            {requests.map((request) => {
              return (
                <Box
                  display="flex"
                  justifyContent="space-evenly"
                  alignItems="center"
                  my="1.5rem"
                  bg="blue.tertiary"
                  p="0.5rem"
                  key={request.id}
                >
                  {request.from_user.avatar_url !== null ? (
                    <Image
                      width="50px"
                      height="50px"
                      borderRadius="50%"
                      src={request.from_user.avatar_url}
                      alt="profile picture"
                    />
                  ) : (
                    <Box
                      width="50px"
                      height="50px"
                      color="#fff"
                      borderRadius="50%"
                      display="flex"
                      bg={request.from_user.color}
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {request.from_user.initials}
                    </Box>
                  )}
                  <Text fontSize="0.9rem" color="text.primary">
                    {request.from_user.first_name} {request.from_user.last_name} has sent
                    you a friend request
                  </Text>
                  <Box display="flex">
                    <Button
                      onClick={(e) =>
                        acceptRequest(
                          e,
                          request.id,
                          request.from_user.id,
                          request.to_user.id
                        )
                      }
                      mx="0.25rem"
                      type="submit"
                      _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                      bg="blue.quatenary"
                      color="#fff"
                      width="80%"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={(e) => ignoreRequest(e, request.id)}
                      mx="0.25rem"
                      type="submit"
                      _hover={{ background: 'text.primary', opacity: 0.8 }}
                      bg="text.primary"
                      color="#fff"
                      width="80%"
                    >
                      Ignore
                    </Button>
                  </Box>
                </Box>
              );
            })}
            {hasNext && (
              <Box>
                <Button
                  onClick={() =>
                    fetchRequests(`/friends/requests/${params.userId}/?page=${page}`)
                  }
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
        ) : (
          <Text color="text.primary" fontSize="0.9rem" textAlign="center" my="1.5rem">
            You currently do not have any friend requests.
          </Text>
        )}
      </Box>
    </Box>
  );
};
export default Requests;
