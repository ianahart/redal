import { Box } from '@chakra-ui/react';
import { useState, useCallback, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import CreatePostBtn from '../components/Community/CreatePostBtn';
import Posts from '../components/Community/Posts';

import {
  ICommunity,
  ICommunityContext,
  IRetrieveCommunityResponse,
  IUserContext,
} from '../interfaces';
import { communityState } from '../helpers/data';
import { UserContext } from '../context/user';
import { CommunityContext } from '../context/community';
import CommunityHeader from '../components/Community/CommunityHeader';

const AuthorCommunity = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [community, setCommunity] = useState<ICommunity>(communityState);

  const fetchCommunity = async (id: number) => {
    try {
      const response = await http.get<IRetrieveCommunityResponse>(`/community/${id}/`);
      setCommunity(response.data.community);
      setIsMember(response.data.is_member);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404) {
          setError(err.response.data.error);
          navigate('/redal/');
        }
      }
    }
  };

  const handleSetIsMember = useCallback(
    (isMember: boolean) => {
      setIsMember(isMember);
    },
    [setIsMember]
  );

  useEffect(() => {
    fetchCommunity(location.state.community.id);
  }, [location.state.community.id, location.state.community.slug]);

  return (
    <Box minH="100vh">
      <CommunityHeader
        community={community}
        isMember={isMember}
        handleSetIsMember={handleSetIsMember}
      />
      <Box
        display="flex"
        justifyContent="center"
        flexDir="column"
        margin=" 3rem auto 2rem auto"
        width={['95%', '95%', '750px']}
      >
        <CreatePostBtn
          community={community}
          avatar_url={user.avatar_url}
          initials={user.initials}
          color={user.color}
        />
        <Posts community={community} />
      </Box>
    </Box>
  );
};

export default AuthorCommunity;
