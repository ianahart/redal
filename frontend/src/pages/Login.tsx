import {
  Box,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState, FormEvent, ChangeEvent, useContext } from 'react';
import { UserContext } from '../context/user';
import { loginState } from '../helpers/data';
import { http } from '../helpers/utils';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ILoginForm, ILoginResponse, IUserContext } from '../interfaces';
const Login = () => {
  const navigate = useNavigate();
  const { setUser, stowTokens } = useContext(UserContext) as IUserContext;
  const [form, setForm] = useState<ILoginForm>(loginState);
  const [error, setError] = useState('');

  const applyErrors = <T extends object>(data: T) => {
    for (const [key, value] of Object.entries(data)) {
      updateForm(key, value, 'error');
    }
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      if (checkIfEmptyFields()) {
        setError('Please fill out both fields.');
        return;
      }

      const response = await http.post<ILoginResponse>('/auth/login/', {
        email: form.email.value,
        password: form.password.value,
      });

      setUser(response.data.user);
      stowTokens(response.data.tokens);
      navigate('/redal');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 400) {
          applyErrors(err.response.data);
        }
      }
    }
  };

  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const checkIfEmptyFields = () => {
    let emptyFields = false;
    for (const [_, value] of Object.entries(form)) {
      if (value.value.trim().length === 0) {
        emptyFields = true;
      }
    }
    return emptyFields;
  };

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ILoginForm], [prop]: value },
    }));
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  return (
    <Box minH="100vh">
      <Box
        width={['95%', '400px', '400px']}
        minH="600px"
        m="5rem auto 2rem auto"
        bg="blue.secondary"
        borderRadius="3px"
      >
        <Heading mb="3rem" pt="2rem" color="text.primary">
          Login
        </Heading>
        {error && (
          <Text fontSize="0.85rem" color="red.primary">
            {error}
          </Text>
        )}

        <form onSubmit={handleOnSubmit}>
          <FormControl my="4em" p="0 0.5rem">
            <FormLabel color="text.primary">Email</FormLabel>
            <Input
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              name={form.email.name}
              value={form.email.value}
              color="#fff"
              border="none"
              background="blue.tertiary"
              type={form.email.type}
            />
            {form.email.error && (
              <Text mt="0.5rem" color="red.primary" fontSize="0.85rem">
                {form.email.error}
              </Text>
            )}
          </FormControl>
          <FormControl my="4rem" p="0 0.5rem">
            <FormLabel color="text.primary">Password</FormLabel>
            <Input
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              name={form.password.name}
              value={form.password.value}
              color="#fff"
              border="none"
              background="blue.tertiary"
              type={form.password.type}
            />
            {form.password.error && (
              <Text mt="0.5rem" color="red.primary" fontSize="0.85rem">
                {form.password.error}
              </Text>
            )}
          </FormControl>

          <Box textAlign="right" m="1rem" mb="2rem">
            <RouterLink to="/forgot-password">
              <Text color="text.primary">Forgot password?</Text>
            </RouterLink>
          </Box>
          <Box>
            <Button
              type="submit"
              _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
              bg="blue.quatenary"
              color="#fff"
              width="80%"
              margin="0 auto"
            >
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
