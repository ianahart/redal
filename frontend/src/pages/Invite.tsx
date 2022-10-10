import {
  Box,
  Text,
  Button,
  FormControl,
  Heading,
  Input,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { http } from '../helpers/utils';

const Invite = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const sendInvite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      setMessage('');
      setError('');
      if (!value.trim().length) {
        setError('Please provide a name.');
        return;
      }
      const response = await http.post('/invites/', {
        value,
        name: location.state.name,
        sender: location.state.user_id,
        image_url: location.state.image_url,
        community: location.state.id,
      });
      setValue('');
      setMessage('Invitation sent.');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        }
      }
    }
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        pb="1.5rem"
        bg="blue.secondary"
        w={['95%', '95%', '600px']}
        m="5rem auto 2rem auto"
        borderRadius="3px"
        minH="400px"
      >
        <Box display="flex" justifyContent="center" flexDir="column" alignItems="center">
          <Heading pt="3rem" fontSize="1.5rem" color="text.primary">
            Send Invite
          </Heading>
          <Image
            mt="1.5rem"
            width="100px"
            height="100px"
            borderRadius="50%"
            src={location.state.image_url}
            alt="community image"
          />
        </Box>
        {error && (
          <Box mt="2rem">
            <Text color="red.primary">{error}</Text>
          </Box>
        )}
        {message && (
          <Box margin="0 auto">
            <Text fontSize="0.85rem" color="text.primary">
              {message}
            </Text>
          </Box>
        )}
        <FormControl margin="2rem auto 0 auto" width="400px">
          <FormLabel color="text.primary">Name</FormLabel>
          <Input
            onChange={handleOnChange}
            onFocus={() => setMessage('')}
            value={value}
            placeholder="Name"
            color="#fff"
            type="text"
            border="none"
            bg="blue.tertiary"
          />
        </FormControl>
        <Box mt="5rem">
          <Button
            width="400px"
            onClick={sendInvite}
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            margin="0 auto"
          >
            Send Invite
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Invite;
