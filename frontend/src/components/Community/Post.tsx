import { Image, Box, Text, Heading } from '@chakra-ui/react';
import { IPost, IUserContext } from '../../interfaces';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BiComment } from 'react-icons/bi';
import { BsBookmark, BsThreeDots } from 'react-icons/bs';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import Bookmark from './Bookmark';
import { http } from '../../helpers/utils';
import { AxiosError } from 'axios';

interface IPostProps {
  postStyle: string;
  post: IPost;
  feed: string;
  upVotePost: (postId: number, action: string) => Promise<void>;
  downVotePost: (postId: number, action: string) => Promise<void>;
  handleUpdateBookmark: (action: string, postId: number) => void;
  deletePost: (postId: number) => Promise<void>;
}

const Post = ({
  postStyle,
  post,
  upVotePost,
  downVotePost,
  handleUpdateBookmark,
  deletePost,
  feed,
}: IPostProps) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as IUserContext;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleUpVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    await upVotePost(postId, action);
  };

  const handleDownVotePost = async (
    e: React.MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    await downVotePost(postId, action);
  };

  const updateBookmark = (action: string) => {
    handleUpdateBookmark(action, post.id);
  };

  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      if (menuRef.current !== null && triggerRef.current !== null) {
        if (!menuRef.current.contains(target) && triggerRef.current !== target) {
          setMenuOpen(false);
        }
      }
    },
    [setMenuOpen]
  );

  const navigateToCommunity = () => {
    navigate(`/redal/${post.community_slug}`, {
      state: { community: { id: post.community_id } },
    });
  };

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  return (
    <Box
      my={postStyle === 'card' ? '1rem' : 0}
      bg="#fff"
      borderColor="border.primary"
      borderRadius="3px"
      borderBottom={postStyle === 'compact' ? '1px solid' : ''}
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
          <Box onClick={(e) => handleUpVotePost(e, post.id, 'add')} cursor="pointer">
            <ImArrowUp color={post.user_upvoted === 'upvoted' ? '#0080FF' : '#8a8f9d'} />
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
        <Box flexGrow="2" width="90%">
          <Box display="flex" color="text.primary" my="0.5rem">
            {feed === 'main' ? (
              <Text cursor="pointer" onClick={navigateToCommunity} mx="0.5rem">
                r/{post.community_name}
              </Text>
            ) : (
              <Text mx="0.5rem">r/{post.community_name}</Text>
            )}
            <Image
              width="25px"
              height="25px"
              borderRadius="50%"
              src={post.image_url}
              alt="community image"
            />
          </Box>
          <Box color="text.primary" display="flex">
            <RouterLink to={`/redal/profile/${post.user_id}`}>
              <Text mx="0.5rem">Posted by {post.name}</Text>
            </RouterLink>
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
              <RouterLink to={`/redal/posts/${post.id}`}>
                <Heading fontSize="1.4rem" mx="0.25rem" color="text.primary">
                  {post.title}
                </Heading>
              </RouterLink>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-start"
              m={postStyle === 'card' ? '3rem 1rem 0.5rem 1rem' : '0.25rem'}
            >
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Post;
