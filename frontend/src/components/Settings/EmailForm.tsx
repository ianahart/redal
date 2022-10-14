import { Box, Input, FormControl, Text, FormLabel, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface IEmailFormProps {
  handleOpenModal: (bool: boolean) => void;
  changeEmail: (value: string) => Promise<void>;
  emailError: string;
}

const EmailForm = ({ handleOpenModal, changeEmail, emailError }: IEmailFormProps) => {
  const [value, setValue] = useState('');

  const cancelEmailChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('test');
    e.stopPropagation();
    handleOpenModal(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Box
      width={['90%', '90%', '450px']}
      bg="#fff"
      boxShadow="md"
      margin="5rem auto 2rem auto"
      minH="400px"
      borderRadius="3px"
    >
      <Box pt="1rem">
        <Box
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleOpenModal(false);
          }}
          display="flex"
          justifyContent="flex-end"
          m="1rem"
          cursor="pointer"
        >
          <AiOutlineClose fontSize="1.2rem" />
        </Box>
        <Text pt="3rem" color="text.primary">
          Changing your email will result in logging you out of redal afterwards.
        </Text>
      </Box>
      <Box width="80%" ml="0.5rem" mt="3rem">
        <FormControl>
          {emailError && (
            <Text color="red.primary" fontSize="0.8rem">
              {emailError}
            </Text>
          )}
          <FormLabel width="80%">Email</FormLabel>
          <Input
            type="email"
            value={value}
            onChange={handleOnChange}
            placeholder="New email"
          />
        </FormControl>
      </Box>
      <Box mt="3rem" display="flex" justifyContent="space-evenly">
        <Button onClick={() => changeEmail(value)}>Change</Button>
        <Button onClick={cancelEmailChange}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default EmailForm;
