import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Text,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface IFormInputProps {
  name: string;
  value: string;
  error: string;
  type: string;
  label: string;
  updateForm: (name: string, value: string, prop: string) => void;
}

const FormInput = ({ name, value, error, type, label, updateForm }: IFormInputProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim().length === 0 || value.trim().length > 200) {
      const error = `${label} must be between 1 and 200 characters.`;
      console.log('test');
      updateForm(name, error, 'error');
    }
  };

  return (
    <FormControl p="0 0.5rem">
      <FormLabel color="text.primary">{label}</FormLabel>
      <Input
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        name={name}
        value={value}
        color="#fff"
        border="none"
        background="blue.tertiary"
        type={type}
      />
      {error && (
        <Text mt="0.1rem" fontSize="0.85rem" color="red.primary">
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default FormInput;
