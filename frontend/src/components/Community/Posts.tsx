import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Tooltip,
  Text,
  Image,
  Heading,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { ICommunity, IPost, IPostsResponse, IUserContext } from '../../interfaces';
import { AiOutlineBars, AiOutlineFire } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroller';
import {
  BsSun,
  BsBarChartLine,
  BsBookmark,
  BsThreeDots,
  BsChevronDown,
} from 'react-icons/bs';
import { FiCreditCard } from 'react-icons/fi';
import { BiComment } from 'react-icons/bi';
import Spinner from '../Mixed/Spinner';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { UserContext } from '../../context/user';

interface IPostsProps {
  community: ICommunity;
}

const Posts = ({ community }: IPostsProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  // hot(comments), new (date), top (upvotes)
  const [filter, setFilter] = useState('new');
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postStyle, setPostStyle] = useState('card');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const resetPosts = () => {
    setPosts([]);
    setError('');
    setPage(0);
    setHasNext(false);
  };

  const fetchPosts = async (endpoint: string, curFilter: string) => {
    try {
      setFilter(curFilter);
      resetPosts();
      const response = await http.get<IPostsResponse>(endpoint);
      if (response.data.posts.length === 0) {
        setError('All posts are loaded.');
      }
      setPosts(response.data.posts);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setError(err.response.data.error);
      }
    }
  };

  useEffect(() => {
    if (community.id !== 0) {
      fetchPosts(`/posts/?sort=new&page=0&id=${community.id}`, 'new');
    }
  }, [community.id]);

  const loadMore = async () => {
    try {
      const response = await http.get<IPostsResponse>(
        `posts/?sort=${filter}&page=${page}&id=${community.id}`
      );
      setPosts((prevState) => [...prevState, ...response.data.posts]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const downVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    let shouldSendRequest = true;
    const updated = posts.map((post) => {
      if (post.id === postId) {
        if (post.user_upvoted === 'upvoted') {
          shouldSendRequest = false;
          return post;
        }
        if (post.user_upvoted === null) {
          post.upvote_count = post.upvote_count - 1;
          post.user_upvoted = 'downvoted';
        } else {
          post.upvote_count = post.upvote_count + 1;
          post.user_upvoted = null;
        }
      }
      return post;
    });

    setPosts(updated);
    if (shouldSendRequest) {
      await http.post('/upvotes/', {
        user: user.id,
        post: postId,
        action: 'downvoted',
      });
    }
  };

  const upVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();

    let shouldSendRequest = true;
    const updated = posts.map((post) => {
      if (post.id === postId) {
        if (post.user_upvoted === 'downvoted') {
          console.log('SHOULD NOT SEND REQUESTR');
          shouldSendRequest = false;
          return post;
        }
        if (post.user_upvoted === null) {
          post.upvote_count = post.upvote_count + 1;
          post.user_upvoted = 'upvoted';
        } else {
          post.upvote_count = post.upvote_count - 1;
          post.user_upvoted = null;
        }
      }
      return post;
    });

    setPosts(updated);
    if (shouldSendRequest) {
      console.log('SHOULD ESND REQUEST');
      await http.post('/upvotes/', {
        user: user.id,
        post: postId,
        action: 'upvoted',
      });
    }
  };

  return (
    <Box my="2rem">
      <Box
        height="50px"
        borderColor="border.primary"
        border="1px solid"
        borderRadius="3px"
        display="flex"
        alignItems="center"
        bg="#fff"
        justifyContent="space-between"
      >
        <Box display="flex">
          <Tooltip label="New" placement="auto-end">
            <Box
              onClick={() =>
                fetchPosts(`/posts/?sort=new&page=0&id=${community.id}`, 'new')
              }
              borderBottom={filter === 'new' ? '2px solid' : ''}
              pb="0.25rem"
              borderColor="text.primary"
              cursor="pointer"
              mx="2rem"
            >
              <BsSun color="#8a8f9d" fontSize="1.5rem" />
            </Box>
          </Tooltip>
          <Tooltip label="Hot" placement="auto-end">
            <Box
              onClick={() =>
                fetchPosts(`/posts/?sort=hot&page=0&id=${community.id}`, 'hot')
              }
              borderBottom={filter === 'hot' ? '2px solid' : ''}
              borderColor="text.primary"
              pb="0.25rem"
              cursor="pointer"
              mx="2rem"
            >
              <AiOutlineFire color="#8a8f9d" fontSize="1.5rem" />
            </Box>
          </Tooltip>
          <Tooltip label="Top" placement="auto-end">
            <Box
              onClick={() =>
                fetchPosts(`/posts/?sort=top&page=0&id=${community.id}`, 'top')
              }
              borderBottom={filter === 'top' ? '2px solid' : ''}
              borderColor="text.primary"
              pb="0.25rem"
              cursor="pointer"
              mx="2rem"
            >
              <BsBarChartLine color="#8a8f9d" fontSize="1.5rem" />
            </Box>
          </Tooltip>
        </Box>
        <Box m="1rem">
          <Menu>
            <Box alignItems="center" display="flex">
              {postStyle === 'card' ? (
                <Box mr="0.5rem">
                  <FiCreditCard color="#8a8f9d" fontSize="1.5rem" />
                </Box>
              ) : (
                <Box mr="0.5rem">
                  <AiOutlineBars color="#8a8f9d" fontSize="1.5rem" />
                </Box>
              )}
              <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                {postStyle}
              </MenuButton>
            </Box>
            <MenuList>
              <MenuItem onClick={() => setPostStyle('card')}>Card</MenuItem>
              <MenuItem onClick={() => setPostStyle('compact')}>Compact</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      {error && (
        <Text color="red.primary" fontSize="0.85rem" my="2rem">
          {error}
        </Text>
      )}

      {posts.length > 0 && (
        <Box width="100%" my="2rem">
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasNext}
            loader={
              <div className="loader" key={0}>
                <Spinner height="70px" width="70px" />
              </div>
            }
            useWindow={true}
          >
            {posts.map((post) => {
              return (
                <Box
                  my={postStyle === 'card' ? '1rem' : 0}
                  bg="#fff"
                  borderColor="border.primary"
                  borderRadius="3px"
                  borderBottom={postStyle === 'compact' ? '1px solid' : ''}
                  key={post.id}
                >
                  <Box display="flex">
                    <Box
                      bg="#ede9e9"
                      flex="1 1 auto"
                      width="10%"
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                      flexDir="column"
                    >
                      <Box
                        onClick={(e) => upVotePost(e, post.id, 'add')}
                        cursor="pointer"
                      >
                        <ImArrowUp
                          color={post.user_upvoted === 'upvoted' ? '#0080FF' : '#8a8f9d'}
                        />
                      </Box>
                      <Box>
                        <Text>{post.upvote_count}</Text>
                      </Box>
                      <Box
                        onClick={(e) => downVotePost(e, post.id, 'subtract')}
                        cursor="pointer"
                      >
                        <ImArrowDown
                          color={post.user_upvoted === 'downvoted' ? 'orange' : '#8a8f9d'}
                        />
                      </Box>
                    </Box>
                    <Box flexGrow="2" width="90%">
                      <Box color="text.primary" display="flex">
                        <Text mx="0.5rem">Posted by {post.name}</Text>
                        <Text mx="0.5rem">{post.display_date}</Text>
                      </Box>
                      {postStyle === 'card' && (
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
                      )}
                      <Box display={postStyle === 'card' ? 'block' : 'flex'}>
                        <Box textAlign="left" cursor="pointer">
                          <Heading fontSize="1.4rem" mx="0.25rem" color="text.primary">
                            {post.title}
                          </Heading>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          m={postStyle === 'card' ? '3rem 1rem 0.5rem 1rem' : '0.25rem'}
                        >
                          <Box
                            cursor="pointer"
                            alignItems="center"
                            mx="1rem"
                            display="flex"
                          >
                            <BiComment color="#8a8f9d" fontSize="1rem" />
                            <Text color="text.primary" ml="0.5rem">
                              {post.comment_count} comments
                            </Text>
                          </Box>
                          <Box
                            cursor="pointer"
                            alignItems="center"
                            mx="1rem"
                            display="flex"
                          >
                            <BsBookmark color="#8a8f9d" fontSize="1rem" />
                            <Text
                              color="text.primary"
                              ml="0.5rem"
                              role="button"
                              cursor="pointer"
                            >
                              Save
                            </Text>
                          </Box>
                          <Box
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            mx="1rem"
                          >
                            <BsThreeDots color="#8a8f9d" fontSize="1rem" />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

export default Posts;
