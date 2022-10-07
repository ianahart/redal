import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { IPost, IUserContext } from '../interfaces';
import { AiOutlineBars } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroller';
import { BsChevronDown } from 'react-icons/bs';
import { FiCreditCard } from 'react-icons/fi';
import Spinner from '../components/Mixed/Spinner';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import { UserContext } from '../context/user';
import Post from '../components/Community/Post';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { nanoid } from 'nanoid';

const Redal = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postStyle, setPostStyle] = useState('card');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const handleUpdateBookmark = (action: string, postId: number) => {
    const bookmarked = action === 'add' ? true : false;
    const updated = posts.map((post) => {
      if (post.id === postId) {
        post.user_bookmarked = bookmarked;
      }
      return post;
    });
    setPosts(updated);
  };

  const resetPosts = () => {
    setPosts([]);
    setError('');
    setPage(0);
    setHasNext(false);
  };

  const fetchPosts = async (endpoint: string) => {
    try {
      resetPosts();
      const response = await http.get(endpoint);
      if (response.data.posts.length === 0) {
        setError('All posts are loaded.');
      }
      setPosts(response.data.posts);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.error);
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchPosts('/posts/all/?page=0');
  });

  const loadMore = async () => {
    try {
      const response = await http.get(`posts/all/?page=${page}`);
      setPosts((prevState) => [...prevState, ...response.data.posts]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const downVotePost = async (postId: number, action: string) => {
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

  const upVotePost = async (postId: number, action: string) => {
    let shouldSendRequest = true;
    const updated = posts.map((post) => {
      if (post.id === postId) {
        if (post.user_upvoted === 'downvoted') {
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
      await http.post('/upvotes/', {
        user: user.id,
        post: postId,
        action: 'upvoted',
      });
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const updated = posts.filter((post) => post.id !== postId);
      setPosts(updated);
      const response = await http.delete(`/posts/${postId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box bg="blue.primary" minH="100vh" my="2rem">
      <Box m="5rem auto 2rem auto" width={['90%', '90%', '650px']}>
        <Box
          height="50px"
          borderColor="border.primary"
          border="1px solid"
          borderRadius="3px"
          display="flex"
          alignItems="center"
          bg="#fff"
          justifyContent="flex-end"
        >
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
                <div style={{ margin: '0 auto' }} className="loader" key={0}>
                  <Spinner height="70px" width="70px" />
                </div>
              }
              useWindow={true}
            >
              {posts.map((post) => {
                return (
                  <Post
                    key={nanoid()}
                    post={post}
                    upVotePost={upVotePost}
                    downVotePost={downVotePost}
                    postStyle={postStyle}
                    handleUpdateBookmark={handleUpdateBookmark}
                    deletePost={deletePost}
                  />
                );
              })}
            </InfiniteScroll>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Redal;
