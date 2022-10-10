import { Button, Box, Heading, Image, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { CommunityContext } from '../context/community';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { ICommunityContext, IInvite } from '../interfaces';

const Invites = () => {
  const { handleSetCommunities } = useContext(CommunityContext) as ICommunityContext;
  const [invites, setInvites] = useState<IInvite[]>([]);
  const [error, setError] = useState('');
  const fetchInvites = async () => {
    try {
      const response = await http.get('/invites/');
      if (response.data.invites.length === 0) {
        setError('You currently do not have any invitiations');
      }
      setInvites(response.data.invites);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchInvites();
  });

  const acceptInvite = async (invite: IInvite) => {
    try {
      setInvites(invites.filter((i) => i.id !== invite.id));
      const response = await http.post('/privates/', {
        community: invite.community.id,
        user: invite.receiver.id,
        invite_id: invite.id,
      });
      handleSetCommunities([response.data.community]);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const denyInvite = async (inviteId: number) => {
    try {
      setInvites(invites.filter((invite) => invite.id !== inviteId));
      await http.delete(`/invites/${inviteId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        borderRadius="3px"
        margin="3rem auto"
        bg="blue.secondary"
        minH="400px"
        width={['90%', '90%', '600px']}
      >
        <Heading pt="1.5rem" fontSize="1.75rem" color="text.primary">
          Invitations
        </Heading>
        {error && (
          <Box>
            <Text color="text.primary" fontSize="0.85rem">
              {error}
            </Text>
          </Box>
        )}
        <Box my="2rem">
          {invites.map((invite) => {
            return (
              <Box key={invite.id} bg="blue.tertiary" p="0.5rem 0.25rem">
                <Box display="flex" alignItems="center">
                  {invite.sender.avatar_url !== null ? (
                    <Image
                      width="40px"
                      height="40px"
                      borderRadius="50%"
                      src={invite.sender.avatar_url}
                      alt="profile image"
                    />
                  ) : (
                    <Box
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                      color="#fff"
                    >
                      {invite.sender.initials}
                    </Box>
                  )}

                  <Box>
                    <Text ml="0.5rem" color="text.primary">
                      {invite.sender.first_name} {invite.sender.last_name} Has sent you an
                      invitation to join{' '}
                      <Text as="span" fontWeight="bold">
                        {invite.community.name}
                      </Text>
                    </Text>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => acceptInvite(invite)}
                    mx="0.5rem"
                    _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                    bg="blue.quatenary"
                    color="#fff"
                  >
                    Accept
                  </Button>

                  <Button
                    onClick={() => denyInvite(invite.id)}
                    mx="0.5rem"
                    _hover={{ background: 'text.primary', opacity: 0.8 }}
                    bg="text.primary"
                    color="#fff"
                  >
                    Deny
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Invites;
