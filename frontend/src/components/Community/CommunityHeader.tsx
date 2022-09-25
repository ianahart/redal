import { Box, Image, Heading, Text, Button } from '@chakra-ui/react';
import { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';

import {
  IRtrieveMemberResponse,
  ICommunity,
  ICommunityContext,
  IMember,
  IUserContext,
} from '../../interfaces';
import { UserContext } from '../../context/user';
import { CommunityContext } from '../../context/community';
import { memberState } from '../../helpers/data';

interface ICommunityHeaderProps {
  community: ICommunity;
  isMember: boolean;
  handleSetIsMember: (isMember: boolean) => void;
}

const CommunityHeader = ({
  community,
  isMember,
  handleSetIsMember,
}: ICommunityHeaderProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  const { setMenuHasNextPage, setMenuCurrentPage, setCommunities } = useContext(
    CommunityContext
  ) as ICommunityContext;
  const [leaveMenuOpen, setLeaveMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [member, setMember] = useState<IMember>(memberState);
  const leaveMenuRef = useRef<HTMLDivElement>(null);
  const leaveMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const closeMemberMenu = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;
      if (leaveMenuRef.current !== null && leaveMenuTriggerRef.current !== null) {
        if (
          !leaveMenuRef.current.contains(target) &&
          leaveMenuTriggerRef.current !== target
        ) {
          setLeaveMenuOpen(false);
        }
      }
    },
    [setLeaveMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('click', closeMemberMenu);
    return () => window.removeEventListener('click', closeMemberMenu);
  }, [closeMemberMenu]);

  const joinCommunity = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const response = await http.post('/members/', {
        community: community.id,
        user: user.id,
      });
      if (response.status === 200) {
        handleSetIsMember(true);
        await reloadCommunities();
      }
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const reloadCommunities = async () => {
    const response = await http.get('/community/?page=0');
    setMenuCurrentPage(response.data.page);
    setMenuHasNextPage(response.data.has_next);
    setCommunities(response.data.communities);
  };

  const leaveCommunity = async (e: React.MouseEvent<HTMLParagraphElement>) => {
    try {
      e.stopPropagation();
      await http.delete(`/members/${member.id}/`);
      reloadCommunities();
      handleSetIsMember(false);
      setMember(memberState);
      setLeaveMenuOpen(false);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const openMemberMenu = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setLeaveMenuOpen(true);
      const response = await http.get<IRtrieveMemberResponse>(
        '/members/by-community/?community_id=' + community.id
      );
      setMember(response.data.member);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box minH="100vh">
      <Box height="80px" bg="blue.tertiary"></Box>
      <Box
        justifyContent="center"
        display="flex"
        position="relative"
        bg="#fff"
        p="0.25rem"
        minH="100px"
      >
        <Box
          bg="#fff"
          mt="-30px"
          ml="30px"
          borderRadius="50%"
          height="80px"
          width="80px"
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            borderRadius="50%"
            height="70px"
            width="70px"
            src={community.image_url}
            alt={community.name}
          />
        </Box>
        <Box display="flex" alignItems="center" flexDir={['column', 'row', 'row']}>
          <Heading
            textAlign="center"
            width={['200px', '70%', '70%']}
            color="text.primary"
            fontSize="2rem"
            p="0.5rem 0"
          >
            {community.name}: The latest in the {community.name} world
          </Heading>
          {isMember ? (
            <Box position="relative" width={['40%', '40%', '20%']}>
              <Button
                onClick={openMemberMenu}
                ref={leaveMenuTriggerRef}
                _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                bg="blue.quatenary"
                color="#fff"
                margin="0 auto"
              >
                Member
              </Button>
              {leaveMenuOpen && (
                <Box
                  ref={leaveMenuRef}
                  position="absolute"
                  top="45px"
                  borderRadius="3px"
                  left="0"
                  bg="blue.tertiary"
                  width=" 120px"
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  minH="60px"
                >
                  <Text
                    onClick={leaveCommunity}
                    color="#fff"
                    role="button"
                    cursor="pointer"
                  >
                    Leave
                  </Text>
                </Box>
              )}
            </Box>
          ) : (
            <Button
              onClick={joinCommunity}
              _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
              bg="blue.quatenary"
              color="#fff"
              width={['40%', '40%', '20%']}
              margin="0 auto"
            >
              Join
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityHeader;
