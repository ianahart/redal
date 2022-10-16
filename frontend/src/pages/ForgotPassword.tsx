import {
  Box,
  Text,
  FormLabel,
  FormControl,
  Input,
  Heading,
  Button,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { http } from '../helpers/utils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const sendEmail = async () => {
    try {
      setSent('');
      if (!email.length) return;
      const response = await http.post('/auth/forgot-password/', { email });
      setEmail('');
      setSent('Email Sent');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setEmail('');
        setSent('');
        setError(err.response.data.errors.email[0]);
        return;
      }
    }
  };
  return (
    <Box minH="100vh" bg="blue.primary">
      <Box
        m="5rem auto 2rem auto"
        bg="blue.secondary"
        minH="400px"
        width={['90%', '90%', '450px']}
      >
        <Heading pt="3rem" fontSize="1.1rem" color="text.primary">
          Forgot Password ?
        </Heading>
        {error && (
          <Text fontSize="0.85rem" color="red.primary">
            {error}
          </Text>
        )}
        {sent && (
          <Box display="flex" justifyContent="center" alignItems="center" mt="2rem">
            <AiOutlineCheck color="limegreen" />
            <Text color="text.primary" fontSize="0.8rem">
              {sent}
            </Text>
          </Box>
        )}

        <Box mt="2rem">
          <Text color="text.primary" fontSize="0.8rem">
            Please use the email you used to create the account with.
          </Text>
        </Box>

        <FormControl width="80%" ml="1rem" mt="1rem">
          <FormLabel color="text.primary" fontSize="0.85rem">
            Your Email
          </FormLabel>
          <Input
            value={email}
            onChange={handleOnChange}
            border="none"
            bg="blue.tertiary"
            placeholder="Your email"
            type="email"
          />
        </FormControl>
        <Box m="3rem auto 2rem auto">
          <Button
            onClick={sendEmail}
            type="submit"
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            width="80%"
            margin="0 auto"
          >
            Send Email
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
