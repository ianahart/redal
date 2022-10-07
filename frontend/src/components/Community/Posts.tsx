import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { ICommunity, IPost, IPostsResponse, IUserContext } from '../../interfaces';
import { AiOutlineBars, AiOutlineFire } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroller';
import { BsSun, BsBarChartLine, BsChevronDown } from 'react-icons/bs';
import { FiCreditCard } from 'react-icons/fi';
import Spinner from '../Mixed/Spinner';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { UserContext } from '../../context/user';
import Post from './Post';

interface IPostsProps {
  community: ICommunity;
}

const Posts = ({ community }: IPostsProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  const [filter, setFilter] = useState('new');
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
        setError(err.response.data.error);
        return;
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
              <div style={{ margin: '0 auto' }} className="loader" key={0}>
                <Spinner height="70px" width="70px" />
              </div>
            }
            useWindow={true}
          >
            {posts.map((post) => {
              return (
                <Post
                  key={post.id}
                  post={post}
                  upVotePost={upVotePost}
                  downVotePost={downVotePost}
                  postStyle={postStyle}
                  handleUpdateBookmark={handleUpdateBookmark}
                />
              );
            })}
          </InfiniteScroll>
        </Box>
      )}
    </Box>
  );
};

export default Posts;
