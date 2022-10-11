import { Box, Heading, Image, Text, Button } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState, useCallback, useContext, useEffect } from 'react';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/user';
import { userState } from '../helpers/data';
import { http } from '../helpers/utils';
import { IProfileResponse, IUser, IUserContext } from '../interfaces';

const Profile = () => {
  const params = useParams();
  const { user } = useContext(UserContext) as IUserContext;
  const [profile, setProfile] = useState<IUser>(userState);
  const [status, setStatus] = useState('');

  const fetchUser = useCallback(async (user_id: string) => {
    try {
      const response = await http.get<IProfileResponse>(`/account/${user_id}/`);
      setProfile(response.data.user);
      setStatus(response.data.status);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (params.userId) {
      fetchUser(params.userId);
    }
  }, [fetchUser, params.id]);

  const sendFriendRequest = async () => {
    try {
      const response = await http.post('/friends/requests/', {
        to_user: profile.id,
        from_user: user.id,
      });
      setStatus('Request Sent');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const renderButton = () => {
    if (user.id !== profile.id && status === '') {
      return (
        <Box>
          <Button
            onClick={sendFriendRequest}
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            margin="0 auto"
          >
            <Box mx="0.5rem">
              <AiOutlinePlus />
            </Box>
            Add as Friend
          </Button>
        </Box>
      );
    } else if (status.toLowerCase() === 'request sent') {
      return (
        <Box>
          <Button
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            margin="0 auto"
          >
            <Box mx="0.5rem">
              <AiOutlineCheck />
            </Box>
            Request Sent
          </Button>
        </Box>
      );
    } else if (status.toLowerCase() === 'friends') {
      return (
        <Box>
          <Button
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            margin="0 auto"
          >
            <Box mx="0.5rem">
              <AiOutlineCheck />
            </Box>
            Friends
          </Button>
        </Box>
      );
    } else if (user.id === profile.id) {
      return <Box></Box>;
    }
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        width={['95%', '95%', '600px']}
        m="5rem auto 2rem auto"
        bg="blue.secondary"
        p="0.5rem"
        minH="600px"
        borderRadius="3px"
      >
        <Box
          borderTopLeftRadius="50px"
          borderTopRightRadius="3px"
          borderBottomLeftRadius="3px"
          borderBottomRightRadius="3px"
          minH="150px"
          width="100%"
          bg="blue.tertiary"
        ></Box>

        <Box className="profile">
          <Box
            mt="-1.5rem"
            width="130px"
            height="130px"
            bg="blue.secondary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            className="profileImage"
          >
            {profile.avatar_url !== null ? (
              <Image
                width="120px"
                height="120px"
                borderRadius="50%"
                src={profile.avatar_url}
                alt="profile headshot"
              />
            ) : (
              <Box
                display="flex"
                width="120px"
                height="120px"
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                borderRadius="50%"
                color="#fff"
                bg={profile.color}
              >
                {profile.initials}
              </Box>
            )}
          </Box>
          <Box justifyContent="space-around" display="flex">
            <Heading fontSize="1.5rem" color="text.primary">
              Profile
            </Heading>
            {renderButton()}
          </Box>
          <Box mt="3rem" className="name">
            <Box display="flex" justifyContent="space-between">
              <Text color="text.primary" mx="0.5rem">
                Full Name
              </Text>
              <Text
                bg="blue.tertiary"
                p="0.5rem"
                borderRadius="8px"
                width="80%"
                color="text.primary"
              >
                {profile.first_name} {profile.last_name}
              </Text>
            </Box>
          </Box>
          {profile.display_name !== null && (
            <Box mt="3rem" className="about">
              <Box display="flex" justifyContent="space-between">
                <Text color="text.primary" mx="0.5rem">
                  Display Name
                </Text>
                <Text
                  bg="blue.tertiary"
                  p="0.5rem"
                  borderRadius="8px"
                  width="80%"
                  color="text.primary"
                >
                  {profile.display_name}
                </Text>
              </Box>
            </Box>
          )}
          {profile.about !== null && (
            <Box mt="3rem" className="about">
              <Box display="flex" justifyContent="space-between">
                <Text color="text.primary" mx="0.5rem">
                  About
                </Text>
                <Text
                  bg="blue.tertiary"
                  p="0.5rem"
                  borderRadius="8px"
                  width="80%"
                  color="text.primary"
                >
                  {profile.about}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Profile;
