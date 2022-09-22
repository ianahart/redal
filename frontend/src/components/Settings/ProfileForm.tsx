import {
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Text,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import {
  KeyboardEvent,
  ChangeEvent,
  useState,
  useEffect,
  DragEvent,
  MouseEvent,
  useContext,
  useCallback,
} from 'react';
import { AiOutlineClose, AiOutlinePlusCircle, AiOutlineUpload } from 'react-icons/ai';
import { UserContext } from '../../context/user';
import { profileFormState } from '../../helpers/data';
import { IProfileForm, IProfileFormResponse, IUserContext } from '../../interfaces';
import MainHeading from './MainHeading';
import { http } from '../../helpers/utils';

const ProfileForm = () => {
  const { user, updateUser } = useContext(UserContext) as IUserContext;
  const [form, setForm] = useState<IProfileForm>(profileFormState);
  const [dragging, setDragging] = useState(false);
  const [displayCharCounter, setDisplayCharCounter] = useState(30);
  const [aboutCharCounter, setAboutCharCounter] = useState(200);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [imageURL, setImageURL] = useState('');

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageURL('');
    setFileError('');
    if (e.target.files === null) return;
    const file: File = e.target.files[0];
    if (file.size > 1000000) {
      setFileError('Image must be under 1 megabyte.');
      return;
    }
    setFile(file);
  };

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    setImageURL('');
    setFileError('');
    const file = e.dataTransfer.files[0];
    if (file.size > 1000000) {
      setFileError('Image must be under 1 megabyte.');
      return;
    }
    setDragging(false);
    setFile(file);
  };

  const clearErrors = () => {
    for (const [key, val] of Object.entries(form)) {
      updateForm(key, '', 'error');
    }
  };

  const handleOnDragEnter = (e: DragEvent<HTMLDivElement>) => {
    setDragging(true);
  };

  const handleOnDragLeave = (e: DragEvent<HTMLDivElement>) => {
    setDragging(false);
  };

  const removeFile = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setFile(null);
  };

  const prepareFormData = () => {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const formFields = {
      display_name: form.display_name.value,
      about: form.about.value,
    };
    formData.append('form', JSON.stringify(formFields));
    return formData;
  };

  const applyErrors = <T extends object>(errors: T) => {
    for (const [key, field] of Object.entries(errors)) {
      const [error] = field;
      if (key === 'file') {
        setFileError(error);
      }

      updateForm(key, error, 'error');
    }
  };

  const updateProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      clearErrors();
      const formData = prepareFormData();

      const response = await http.patch<IProfileFormResponse>(
        `/account/${user.id}/`,
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' },
        }
      );
      updateUser(response.data.user);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        applyErrors(err.response.data);
      }
    }
  };

  const populateForm = useCallback(() => {
    const show = ['about', 'display_name'];
    for (const [key, val] of Object.entries(user)) {
      if (show.includes(key)) {
        updateForm(key, val ?? '', 'value');
      }
      if (key === 'avatar_url') {
        setImageURL(val);
      }
    }
  }, [user]);

  useEffect(() => {
    populateForm();
  }, [populateForm, user.id]);

  return (
    <Box mt="1.5rem" ml="2rem">
      <MainHeading mainHeader="Customize profile" subHeader="profile information" />
      <Box display="flex" flexDir="column">
        <FormControl mt="3rem" p="0 0.5rem" width={['100%', '90%', '520px']}>
          <FormLabel color="text.primary">Display name (optional)</FormLabel>
          <FormHelperText textAlign="left" my="1rem">
            Set a display name. This does not change your username.
          </FormHelperText>
          {form.display_name.error && (
            <Text textAlign="left" color="red.primary" fontSize="0.85rem" my="1rem">
              {form.display_name.error}
            </Text>
          )}
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
            {form.about.error && (
              <Text textAlign="left" color="red.primary" fontSize="0.85rem" my="1rem">
                {form.about.error}
              </Text>
            )}

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
        <Text
          width={['100%', '90%', '520px']}
          fontSize="0.8rem"
          textAlign="left"
          mt="3rem"
          borderBottom="1px solid"
          borderColor="text.primary"
          textTransform="uppercase"
        >
          images
        </Text>
        {fileError && (
          <Text textAlign="left" mt="1rem" color="red.primary" fontSize="0.85rem">
            {fileError}
          </Text>
        )}
        <Box
          style={{
            backgroundSize: imageURL ? 'cover' : '',
            backgroundPosition: 'center',
            backgroundRepeat: imageURL ? 'no-repeat' : '',
            backgroundImage: imageURL ? `url(${imageURL})` : '',
          }}
          m="1.5rem 0 2rem 0"
          borderRadius="8px"
          width={imageURL ? '180px' : '300px'}
          onDragEnter={handleOnDragEnter}
          onDragLeave={handleOnDragLeave}
          bg="blue.tertiary"
          onDrop={handleOnDrop}
          position="relative"
          height="180px"
        >
          {!dragging && !file && (
            <Box>
              <Box display="flex" justifyContent="center" mt="2rem" mb="0.5rem">
                <AiOutlinePlusCircle fontSize="3rem" />
              </Box>
              <Text fontSize="0.8rem">Drag and Drop or Upload Avatar Image</Text>
            </Box>
          )}
          {dragging && (
            <Box
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              mt="2rem"
              mb="0.5rem"
            >
              <AiOutlineUpload fontSize="3rem" />
              <Text fontSize="0.8rem">Drop image</Text>
            </Box>
          )}

          {!dragging && file && (
            <Box my="1rem" justifyContent="center" alignItems="center" display="flex">
              <Text mr="1rem" fontSize="1.1rem">
                {file.name}
              </Text>
              <Box cursor="pointer" zIndex="3" onClick={removeFile}>
                <AiOutlineClose />
              </Box>
            </Box>
          )}

          <Input
            onChange={handleFileChange}
            opacity="0"
            type="file"
            accept="image/*"
            top="0"
            left="0"
            height="180px"
            position="absolute"
          />
        </Box>
      </Box>
      <Box width="300px" display="flex" justifyContent="flex-start" my="3rem" pb="2rem">
        <Button
          onClick={updateProfile}
          _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
          bg="blue.quatenary"
          color="#fff"
          width="100%"
          margin="0 auto"
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;
