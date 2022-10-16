import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Button,
  Input,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { http } from '../helpers/utils';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('uid');
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('password');

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (name === 'confirm_password') {
      setConfirmPassword(value);
    } else {
      setNewPassword(value);
    }
  };

  const resetPassword = async () => {
    try {
      if (!newPassword.length || !confirmPassword.length) {
        setError('Please fill out both fields');
        return;
      }
      const response = await http.patch(`/auth/reset-password/${userId}/`, {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.errors);
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
          Reset Password
        </Heading>
        {error && (
          <Text fontSize="0.85rem" color="red.primary">
            {error}
          </Text>
        )}

        <Box mt="2rem">
          <Text color="text.primary" fontSize="0.8rem">
            Pass word must be different than your old password.
          </Text>
        </Box>

        <FormControl position="relative" width="80%" ml="1rem" mt="1rem">
          <FormLabel color="text.primary" fontSize="0.85rem">
            Old password
          </FormLabel>
          <Input
            name="new_password"
            value={newPassword}
            onChange={handleOnChange}
            border="none"
            bg="blue.tertiary"
            color="#fff"
            placeholder="New password"
            type={type}
          />
          <Box right="5px" top="35px" position="absolute">
            {type === 'text' ? (
              <Box onClick={() => setType('password')} cursor="pointer">
                <AiOutlineEyeInvisible color="gray" fontSize="1.1rem" />
              </Box>
            ) : (
              <Box cursor="pointer" onClick={() => setType('text')}>
                <AiOutlineEye color="gray" fontSize="1.1rem" />
              </Box>
            )}
          </Box>
        </FormControl>

        <FormControl width="80%" ml="1rem" mt="1rem">
          <FormLabel color="text.primary" fontSize="0.85rem">
            Confirm password
          </FormLabel>
          <Input
            name="confirm_password"
            value={confirmPassword}
            onChange={handleOnChange}
            color="#fff"
            border="none"
            bg="blue.tertiary"
            placeholder="Confirm password"
            type={type}
          />
        </FormControl>

        <Box m="3rem auto 2rem auto">
          <Button
            onClick={resetPassword}
            type="submit"
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            width="80%"
            margin="0 auto"
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
