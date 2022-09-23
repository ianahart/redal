import {
  Box,
  Button,
  Select,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createCommunityFormState } from '../helpers/data';
import {
  ICommunityContext,
  ICreateCommunityForm,
  ICreateCommunityResponse,
  IUserContext,
} from '../interfaces';
import { http } from '../helpers/utils';
import { UserContext } from '../context/user';
import Spinner from '../components/Mixed/Spinner';
import { CommunityContext } from '../context/community';

const CreateCommunity = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const { setCommunities, handleSetCommunities, setMenuHasNextPage, setMenuCurrentPage } =
    useContext(CommunityContext) as ICommunityContext;
  const navigate = useNavigate();
  const [form, setForm] = useState<ICreateCommunityForm>(createCommunityFormState);
  const [file, setFile] = useState<File | null>(null);
  const [formHelperText, setFormHelperText] = useState('');
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ICreateCommunityForm], [prop]: value },
    }));
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleOnSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  useEffect(() => {
    const public_str = 'Anyone can view, post, and comment to this community.';
    const private_str = 'Only approved users can view and submit to this community.';
    switch (form.type.value) {
      case 'public':
        setFormHelperText(public_str);
        break;
      case 'private':
        setFormHelperText(private_str);
        break;
      default:
        setFormHelperText('');
    }
  }, [form.type.value]);

  const handleOnFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file: File = e.target.files[0];
    if (file.size > 1000000) {
      setFileError('Image must be under 1 megabyte(MB)');
      return;
    }
    setFile(file);
  };

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    const file: File = e.dataTransfer.files[0];
    if (file.size > 1000000) {
      setFileError('Image must be under 1 megabyte(MB)');
      return;
    }
    setFile(file);
  };

  const createFormData = () => {
    const formData = new FormData();
    const formFields = {
      author: user.id,
      user: user.id,
      type: form.type.value,
      name: form.name.value,
    };
    if (file) {
      formData.append('file', file);
    }
    formData.append('form', JSON.stringify(formFields));
    return formData;
  };

  const checkForEmptyFields = () => {
    let emptyFields = false;
    for (const [key, field] of Object.entries(form)) {
      if (field.value.trim().length === 0) {
        emptyFields = true;
      }
      if (!file) {
        emptyFields = true;
      }
    }
    return emptyFields;
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setFormError('');
      setLoading(true);
      if (checkForEmptyFields()) {
        setFormError('Please make sure to fill out all fields.');
        return;
      }

      const formData = createFormData();
      const response = await http.post<ICreateCommunityResponse>(
        '/community/create/',
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' },
        }
      );
      setCommunities(response.data.communities);
      setMenuCurrentPage(response.data.page);
      setMenuHasNextPage(response.data.has_next);
      setLoading(false);
      navigate('/redal');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoading(false);
        if (err.response.status === 400) {
          applyErrors(err.response.data);
        }
      }
    }
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

  return (
    <Box minH="100vh">
      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Spinner height="200px" width="200px" />
        </Box>
      ) : (
        <Box minH="100vh">
          <Box
            width={['95%', '95%', '550px']}
            bg="blue.secondary"
            margin="5rem auto 2rem auto"
            borderRadius="3px"
            minH="500px"
          >
            <form onSubmit={handleOnSubmit}>
              <Box py="1rem" as="header">
                <Heading color="text.primary" fontSize="1.4rem">
                  Create a community
                </Heading>
                {formError && (
                  <Text fontSize="0.85rem" color="red.primary">
                    {formError}
                  </Text>
                )}
              </Box>
              <FormControl width={['100%', '100%', '80%']} p="0 0.5rem">
                <FormLabel color="text.primary">Community name</FormLabel>
                <Input
                  onChange={handleOnInputChange}
                  name={form.name.name}
                  placeholder="Community name"
                  value={form.name.value}
                  color="#fff"
                  border="none"
                  background="blue.tertiary"
                  type="text"
                />

                {form.name.error && (
                  <Text
                    m="0 0.5rem"
                    color="red.primary"
                    textAlign="left"
                    fontSize="0.85rem"
                  >
                    {form.name.error}
                  </Text>
                )}
              </FormControl>
              <FormLabel m="2rem 0 0.5rem 0" pl="0.5rem" color="text.primary">
                Community Type
              </FormLabel>
              {formHelperText && (
                <Text
                  color="text.primary"
                  my="0.25rem"
                  textAlign="left"
                  p="0.5rem"
                  fontSize="0.8rem"
                >
                  {formHelperText}
                </Text>
              )}
              <Select
                name={form.type.name}
                onChange={handleOnSelectChange}
                value={form.type.value}
                borderColor="blue.tertiary"
                bg="blue.tertiary"
                color="text.primary"
                width={['100%', '100%', '80%']}
                p="0 0.5rem"
                placeholder="Select option"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
              {form.type.error && (
                <Text
                  m="0 0.5rem"
                  color="red.primary"
                  textAlign="left"
                  fontSize="0.85rem"
                >
                  {form.type.error}
                </Text>
              )}
              <Text
                color="text.primary"
                width={['100%', '100%', '80%']}
                textAlign="left"
                m="0 0.5rem"
                fontSize="0.85rem"
                borderBottom="1px solid"
                pb="0.25rem"
                mt="2rem"
                mb="1rem"
                textTransform="uppercase"
              >
                image
              </Text>
              {fileError && (
                <Text
                  margin="0 0.5rem"
                  fontSize="0.85rem"
                  color="red.primary"
                  mb="0.25rem"
                  textAlign="left"
                >
                  {fileError}
                </Text>
              )}
              <Box
                m="0 0.5rem"
                borderRadius="3px"
                minH="160px"
                onDrop={handleOnDrop}
                width={['100%', '100%', '40%']}
                mb="1rem"
                bg="blue.tertiary"
                position="relative"
              >
                <Box color="text.primary" p="1.5rem">
                  {!file && (
                    <Box display="flex" justifyContent="center" mt="2rem" mb="0.5rem">
                      <AiOutlinePlusCircle fontSize="3rem" />
                    </Box>
                  )}
                  {!file && <Text fontSize="0.8rem">Drag and Drop or Upload Image</Text>}
                  {file && <Text fontSize="0.8rem">{file.name}</Text>}
                </Box>
                <Input
                  onChange={handleOnFileChange}
                  zIndex="3"
                  opacity="0"
                  type="file"
                  position="absolute"
                  width="100%"
                  height="100%"
                  top="0"
                  left="0"
                  accept="image/*"
                />
              </Box>

              {file && (
                <Box m="0.5rem" textAlign="left" p="0.5rem">
                  <Button
                    onClick={() => setFile(null)}
                    color="text.primary"
                    border="1px solid"
                    cursor="pointer"
                    borderColor="text.primary"
                    borderRadius="20px"
                    _hover={{ background: 'transparent' }}
                    background="transparent"
                  >
                    Clear
                  </Button>
                </Box>
              )}
              <Box
                width="300px"
                display="flex"
                justifyContent="flex-start"
                my="3rem"
                ml="0.5rem"
                pb="2rem"
              >
                <Button
                  type="submit"
                  _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
                  bg="blue.quatenary"
                  color="#fff"
                  width="100%"
                  margin="0 auto"
                >
                  Create
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default CreateCommunity;
