import { Box } from '@chakra-ui/react';
import { useState, useCallback, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';

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
    </Box>
  );
};

export default AuthorCommunity;
