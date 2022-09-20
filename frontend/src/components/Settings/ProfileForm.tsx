import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { KeyboardEvent, ChangeEvent, useState, useEffect } from 'react';
import { ProfileFormState } from '../../helpers/data';
import { IProfileForm } from '../../interfaces';
import MainHeading from './MainHeading';

const ProfileForm = () => {
  const [form, setForm] = useState<IProfileForm>(ProfileFormState);
  const [displayCharCounter, setDisplayCharCounter] = useState(30);
  const [aboutCharCounter, setAboutCharCounter] = useState(200);

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IProfileForm], [prop]: value },
    }));
  };

  useEffect(() => {
    if (form.display_name.value.length === 0) {
      setDisplayCharCounter(30);
    }
  }, [form.display_name.value.length]);

  useEffect(() => {
    if (form.about.value.length === 0) {
      setAboutCharCounter(200);
    }
  }, [form.about.value.length]);

  const handleOnKeyDownDisplay = (e: KeyboardEvent<HTMLInputElement>) => {
    handleCharCounter(
      e.key,
      form.display_name.value.length,
      displayCharCounter,
      setDisplayCharCounter
    );
  };

  const handleOnKeyDownAbout = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    handleCharCounter(
      e.key,
      form.about.value.length,
      aboutCharCounter,
      setAboutCharCounter
    );
  };

  const handleCharCounter = (
    key: string,
    value: number,
    state: number,
    setState: (state: any) => void
  ) => {
    if (key === 'Backspace' && value) {
      setState((prevState: number) => prevState + 1);
    }
    if (state > 0 && key !== 'Backspace') {
      setState((prevState: number) => prevState - 1);
    }
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim().length <= 30) {
      updateForm(name, value, 'value');
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (value.trim().length <= 200) {
      updateForm(name, value, 'value');
    }
  };

  return (
    <Box mt="1.5rem" ml="2rem">
      <MainHeading mainHeader="Customize profile" subHeader="profile information" />
      <Box display="flex" flexDir="column">
        <FormControl mt="3rem" p="0 0.5rem" width={['100%', '90%', '520px']}>
          <FormLabel color="text.primary">Display name (optional)</FormLabel>
          <FormHelperText textAlign="left" my="1rem">
            Set a display name. This does not change your username.
          </FormHelperText>
          <Input
            onChange={handleOnInputChange}
            onKeyDown={handleOnKeyDownDisplay}
            name={form.display_name.name}
            placeholder="Display name (optional)"
            autoComplete="off"
            value={form.display_name.value}
            color="#fff"
            width="100%"
            border="none"
            background="blue.tertiary"
            type="text"
          />
          <FormHelperText textAlign="left">
            {displayCharCounter} Characters remaining.
          </FormHelperText>
        </FormControl>

        <Box p="0 0.5rem" width={['100%', '90%', '520px']}>
          <FormControl>
            <FormLabel mt="2rem" color="text.primary">
              About (optional)
            </FormLabel>

            <FormHelperText textAlign="left" my="1rem">
              A brief description of yourself shown on your profile.
            </FormHelperText>

            <Textarea
              value={form.about.value}
              onChange={handleTextareaChange}
              onKeyDown={handleOnKeyDownAbout}
              color="#fff"
              name="about"
              bg="blue.tertiary"
              border="none"
            ></Textarea>
            <FormHelperText textAlign="left">
              {aboutCharCounter} Characters remaining.
            </FormHelperText>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileForm;
