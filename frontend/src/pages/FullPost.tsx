import { Box, Image, Text, Heading } from '@chakra-ui/react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Axios, AxiosError } from 'axios';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BiComment } from 'react-icons/bi';
import { BsBookmark, BsThreeDots } from 'react-icons/bs';
import { useEffect, useRef, useCallback, useState, useContext } from 'react';
import { IFullPost, IUserContext } from '../interfaces';
import ReactQuill, { Value } from 'react-quill';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { postState } from '../helpers/data';
import { UserContext } from '../context/user';
import Bookmark from '../components/Community/Bookmark';
import Comments from '../components/Community/Comments';

const FullPost = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const params = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<IFullPost>(postState);
  const modules = { toolbar: [] };

  const fetchPost = async (postId: string) => {
    try {
      if (!postId) return;
      const response = await http.get(`/posts/${postId}`);
      setPost(response.data.post);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    if (params.postId) {
      fetchPost(params.postId);
    }
  });

  const handleUpVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    if (post === null) return;

    if (post.user_upvoted === 'downvoted') {
      return;
    }
    if (post.user_upvoted === null) {
      setPost((prevState) => ({
        ...prevState,
        upvote_count: post.upvote_count + 1,
        user_upvoted: 'upvoted',
      }));
    } else {
      setPost((prevState) => ({
        ...prevState,
        upvote_count: post.upvote_count - 1,
        user_upvoted: null,
      }));
    }
    await http.post('/upvotes/', {
      user: user.id,
      post: postId,
      action: 'upvoted',
    });
  };

  const handleDownVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    if (post === null) return;
    if (post.user_upvoted === 'upvoted') {
      return post;
    }
    if (post.user_upvoted === null) {
      setPost((prevState) => ({
        ...prevState,
        upvote_count: post.upvote_count - 1,
        user_upvoted: 'downvoted',
      }));
    } else {
      setPost((prevState) => ({
        ...prevState,
        upvote_count: post.upvote_count + 1,
        user_upvoted: (post.user_upvoted = null),
      }));
    }

    await http.post('/upvotes/', {
      user: user.id,
      post: postId,
      action: 'downvoted',
    });
  };

  const updateBookmark = (action: string) => {
    const bookmarked = action === 'add' ? true : false;
    setPost((prevState) => ({
      ...prevState,
      user_bookmarked: bookmarked,
    }));
  };

  const clickAway = useCallback(
    (e: MouseEvent) => {
      console.log('click');
      const target = e.target as Element;

      if (menuRef.current !== null && triggerRef.current !== null) {
        if (!menuRef.current.contains(target) && triggerRef.current !== target) {
          setMenuOpen(false);
        }
      }
    },
    [setMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const deletePost = async (postId: number) => {
    try {
      const response = await http.delete(`/posts/${postId}/`);
      navigate(-1);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box minH="100vh">
      <Box
        minH="600px"
        padding="0.5rem"
        width={['95%', '95%', '600px']}
        m="5rem auto 2rem auto"
        bg="#fff"
        borderRadius="3px"
      >
        <Box display="flex">
          {post !== null && (
            <Box
              bg="#ede9e9"
              flex="1 1 auto"
              width="10%"
              justifyContent="center"
              alignItems="center"
              display="flex"
              wordBreak="break-all"
              flexDir="column"
            >
              <Box onClick={(e) => handleUpVotePost(e, post.id, 'add')} cursor="pointer">
                <ImArrowUp
                  color={post.user_upvoted === 'upvoted' ? '#0080FF' : '#8a8f9d'}
                />
              </Box>
              <Box>
                <Text>{post.upvote_count}</Text>
              </Box>
              <Box
                onClick={(e) => handleDownVotePost(e, post.id, 'subtract')}
                cursor="pointer"
              >
                <ImArrowDown
                  color={post.user_upvoted === 'downvoted' ? 'orange' : '#8a8f9d'}
                />
              </Box>
            </Box>
          )}
          <Box width="90%" display="flex" flexDir="column">
            {post !== null && (
              <Box>
                <Box color="text.primary" display="flex">
                  <RouterLink to={`/redal/profile/${post.user_id}`}>
                    <Text mx="0.5rem">Posted by {post.name}</Text>
                  </RouterLink>
                  <Text mx="0.5rem">{post.display_date}</Text>
                </Box>
                <Box m="0.25rem">
                  {post.avatar_url !== null ? (
                    <Image
                      borderRadius="50%"
                      width="40px"
                      height="40px"
                      src={post.avatar_url}
                      alt="avatar photo"
                    />
                  ) : (
                    <Box
                      width="40px"
                      height="40px"
                      borderRadius="50%"
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                      color="#fff"
                    >
                      {post.initials}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            <Box>
              <Heading fontSize="1.6rem" color="text.primary">
                {post.title}
              </Heading>
            </Box>

            <Box m="5rem auto 3rem auto">
              {post !== null && (
                <ReactQuill theme="bubble" readOnly modules={modules} value={post.post} />
              )}
            </Box>

            <Box display="flex" justifyContent="flex-start" m="3rem 1rem 0.5rem 1rem">
              <Box cursor="pointer" alignItems="center" mx="1rem" display="flex">
                <BiComment color="#8a8f9d" fontSize="1rem" />
                <Text color="text.primary" ml="0.5rem">
                  {post.comment_count} comments
                </Text>
              </Box>
              <Bookmark
                postId={post.id}
                userId={user.id}
                userBookmarked={post.user_bookmarked}
                updateBookmark={updateBookmark}
              />
              <Box cursor="pointer" display="flex" alignItems="center" mx="1rem">
                <Box
                  ref={triggerRef}
                  onClick={() => setMenuOpen(true)}
                  position="relative"
                >
                  <BsThreeDots color="#8a8f9d" pointerEvents="none" fontSize="1rem" />
                  {menuOpen && post.user_id === user.id && (
                    <Box
                      ref={menuRef}
                      position="absolute"
                      bg="blue.tertiary"
                      p="0.5rem"
                      top="-40px"
                      left="0"
                      borderRadius="3px"
                    >
                      <Text
                        onClick={() => deletePost(post.id)}
                        fontSize="0.85rem"
                        color="#fff"
                      >
                        Delete
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box my="2rem">
              <Comments postId={post.id} authorId={post.user_id} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FullPost;
