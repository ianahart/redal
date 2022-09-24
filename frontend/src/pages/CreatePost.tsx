import { Box, Button, Input, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  ChangeEvent,
  useMemo,
} from 'react';
import { BsChevronDown } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/user';
import { useNavigate } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import {
  ICommunityName,
  ICreateCommunityPostResponse,
  IUserContext,
} from '../interfaces';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as IUserContext;
  const quillRef = useRef<ReactQuill>(null);
  const [quillValue, setQuillValue] = useState('');
  const [communityNames, setCommunityNames] = useState<ICommunityName[]>([]);
  const [activeName, setActiveName] = useState({ id: 0, name: '' });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [nameError, setNameError] = useState('');

  const [fileError, setFileError] = useState('');
  const uploadService = async (formData: FormData) => {
    try {
      const response = await http.post('/posts/upload/', formData);
      return response.data.url;
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (
          err.response.status === 400 &&
          Object.keys(err.response.data).includes('file')
        ) {
          setFileError(err.response.data.file);
        }
      }
    }
  };

  const imageHandler = () => {
    setFileError('');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input && input.files ? input.files[0] : null;
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      const quillObj = quillRef.current?.getEditor();
      const url = await uploadService(formData);

      const range = quillObj?.getSelection();
      quillObj!.insertEmbed(range!.index, 'image', url);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
          [{ align: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;
      if (menuRef.current !== null && triggerRef.current !== null) {
        if (!menuRef.current.contains(target) && !triggerRef.current.contains(target)) {
          setDropDownOpen(false);
        }
      }
    },
    [setDropDownOpen]
  );

  const fetchCommunityNames = async (endpoint: string) => {
    try {
      const response = await http.get<ICreateCommunityPostResponse>(endpoint);
      setCommunityNames((prevState) => [...prevState, ...response.data.communities]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
      if (page === 1 && !response.data.communities.length) {
        setNameError(
          'You need to create or join a community before you can write a post.'
        );
      }
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          setNameError('Something went wrong loading data. Please try to refresh page.');
        }
      }
    }
  };

  useEffectOnce(() => {
    fetchCommunityNames('/community/names/?page=0');
  });

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const handleSetActiveName = (
    e: React.MouseEvent<HTMLDivElement>,
    id: number,
    name: string
  ) => {
    e.stopPropagation();
    setActiveName((prevState) => ({
      ...prevState,
      id,
      name,
    }));
    setDropDownOpen(false);
  };

  const handleOnChange = (content: any, delta: any, source: any, editor: any) => {
    setQuillValue(editor.getContents());
  };

  const submitPost = async () => {
    try {
      if (
        quillRef.current?.editor?.getText().trim().length === 0 ||
        title.length === 0 ||
        activeName.id === 0
      ) {
        return;
      }

      const response = await http.post('/posts/', {
        post: quillRef.current!.editor!.getContents(),
        avatar_url: user.avatar_url,
        initials: user.initials,
        title,
        community: activeName.id,
        user: user.id,
      });
      navigate('/redal');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const handleOnInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <Box minH="100vh">
      {nameError && (
        <Text color="red.primary" textAlign="center" mt="2rem" fontSize="0.85rem">
          {nameError}
        </Text>
      )}
      <Box
        bg="blue.secondary"
        width={['95%', '95%', '650px']}
        minH="600px"
        display="flex"
        flexDir="column"
        alignItems="flex-start"
        borderRadius="3px"
        m="5rem auto 2rem auto"
      >
        {!nameError && (
          <Box m="5rem 0 0 1rem" width={['95%', '95%', '400px']}>
            <Text
              textAlign="left"
              borderBottom="1px solid"
              color="text.primary"
              borderColor="text.primary"
              fontSize="0.85rem"
              textTransform="uppercase"
            >
              Select community
            </Text>
          </Box>
        )}
        {!nameError && (
          <Box
            ref={triggerRef}
            onClick={() => setDropDownOpen(true)}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bg="blue.tertiary"
            borderRadius="3px"
            padding="0.25rem"
            m="1.5rem 1rem 2rem 1rem"
            color="text.primary"
            height="40px"
            width="300px"
            cursor="pointer"
            position="relative"
          >
            <Text>{activeName.name}</Text>
            <BsChevronDown />
            {dropDownOpen && (
              <Box
                ref={menuRef}
                top="50px"
                zIndex="3"
                left="0"
                position="absolute"
                bg="blue.tertiary"
                borderBottomRadius="3px"
                minH="200px"
                width="300px"
              >
                {communityNames.map(({ id, name }) => {
                  return (
                    <Box
                      onClick={(e) => handleSetActiveName(e, id, name)}
                      _hover={{ background: 'blue.primary' }}
                      cursor="pointer"
                      textAlign="left"
                      padding="0.25rem 0.5rem"
                      key={id}
                    >
                      <Text>{name}</Text>
                    </Box>
                  );
                })}
                {hasNext && (
                  <Text
                    onClick={() => fetchCommunityNames(`/community/names/?page=${page}`)}
                    fontSize="0.8rem"
                    role="button"
                    cursor="pointer"
                  >
                    See more
                  </Text>
                )}
              </Box>
            )}
          </Box>
        )}

        {!nameError && (
          <>
            <Box m="5rem 0 0 1rem" width={['95%', '95%', '400px']}>
              <Text
                textAlign="left"
                borderBottom="1px solid"
                color="text.primary"
                borderColor="text.primary"
                fontSize="0.85rem"
                mb="0.5rem"
                textTransform="uppercase"
              >
                Choose Title
              </Text>
            </Box>
            <Input
              margin="1rem"
              width={['90%', '90%', '300px']}
              placeholder="Title"
              onChange={handleOnInputChange}
              value={title}
              color="#fff"
              border="none"
              background="blue.tertiary"
            />
          </>
        )}

        {fileError && (
          <Text m="1rem" mb="0" fontSize="0.85rem" color="red.primary" textAlign="center">
            {fileError}
          </Text>
        )}
        {!nameError && (
          <Box
            color="text.primary"
            width="90%"
            borderRadius="3px"
            minH="400px"
            bg="#fff"
            m="3rem 1rem 2rem 1rem"
          >
            <ReactQuill
              ref={quillRef}
              modules={modules}
              formats={formats}
              theme="snow"
              value={quillValue}
              onChange={handleOnChange}
            />
          </Box>
        )}
        {!nameError && (
          <Box width={['90%', '90%', '50%']} m="2rem auto">
            <Button
              onClick={submitPost}
              _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
              bg="blue.quatenary"
              color="#fff"
              width="80%"
              margin="0 auto"
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CreatePost;
