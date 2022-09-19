import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import { createAccountState } from '../helpers/data';
import { ICreateAccountForm } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/CreateAccount/FormInput';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ICreateAccountForm>(createAccountState);
  const [formError, setFormError] = useState('');

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ICreateAccountForm], [prop]: value },
    }));
  };

  const changePasswordType = () => {
    const passwordType = form.password.type === 'text' ? 'password' : 'text';
    setForm((prevState) => ({
      ...prevState,
      password: {
        ...prevState['password' as keyof ICreateAccountForm],
        type: passwordType,
      },
      confirm_password: {
        ...prevState['confirm_password' as keyof ICreateAccountForm],
        type: passwordType,
      },
    }));
  };

  const validateEmptyFields = () => {
    let someEmpty = false;
    for (const [_, field] of Object.entries(form)) {
      if (field.value.trim().length === 0) {
        someEmpty = true;
      }
    }
    return someEmpty;
  };

  const checkFormForErrors = () => {
    let errors = false;
    for (const [_, field] of Object.entries(form)) {
      if (field.error.length) {
        errors = true;
      }
    }
    return errors;
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setFormError('');
      if (validateEmptyFields()) {
        setFormError('Please fill out all the fields.');
        return;
      }

      if (checkFormForErrors()) {
        return;
      }
      console.log('submitted');
      const response = await http.post('/auth/register/', {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        password: form.password.value,
        confirm_password: form.confirm_password.value,
      });
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          applyValidationErrors(err.response.data.errors);
        }
      }
    }
  };

  const applyValidationErrors = <T extends object>(errors: T) => {
    if (!Object.keys(errors).length) return;
    for (const [prop, error] of Object.entries(errors)) {
      setForm((prevState) => ({
        ...prevState,
        [prop]: { ...prevState[prop as keyof ICreateAccountForm], error },
      }));
    }
  };
  return (
    <Box minH="100vh">
      <Box
        width={['95%', '600px', '600px']}
        minH="600px"
        m="5rem auto 2rem auto"
        bg="blue.secondary"
        borderRadius="3px"
      >
        <Heading mb="3rem" pt="2rem" color="text.primary">
          Create Account
        </Heading>
        {formError && (
          <Text fontSize="0.85rem" color="red.primary">
            {formError}
          </Text>
        )}
        <form onSubmit={handleOnSubmit}>
          <Box display="flex" width="95%" margin="0 auto">
            <FormInput
              name={form.first_name.name}
              value={form.first_name.value}
              error={form.first_name.error}
              type={form.first_name.type}
              label="First Name"
              updateForm={updateForm}
            />
            <FormInput
              name={form.last_name.name}
              value={form.last_name.value}
              error={form.last_name.error}
              type={form.last_name.type}
              label="Last Name"
              updateForm={updateForm}
            />
          </Box>
          <Box margin="1rem auto" width="95%">
            <FormInput
              name={form.email.name}
              value={form.email.value}
              error={form.email.error}
              type={form.email.type}
              label="Email"
              updateForm={updateForm}
            />
          </Box>

          <Box display="flex" width="95%" margin="3rem auto">
            <Box position="relative" width="100%">
              <Box
                onClick={changePasswordType}
                cursor="pointer"
                position="absolute"
                right="10px"
                top="40px"
                zIndex="1"
              >
                {form.password.type === 'text' ? (
                  <AiOutlineEyeInvisible fontSize="1.4rem" color="#fff" />
                ) : (
                  <AiOutlineEye color="#fff" fontSize="1.4rem" />
                )}
              </Box>

              <FormInput
                name={form.password.name}
                value={form.password.value}
                error={form.password.error}
                type={form.password.type}
                label="Password"
                updateForm={updateForm}
              />
            </Box>
            <FormInput
              name={form.confirm_password.name}
              value={form.confirm_password.value}
              error={form.confirm_password.error}
              type={form.confirm_password.type}
              label="Re-enter Password"
              updateForm={updateForm}
            />
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
              Create Account
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateAccount;
