import { Image, Box, Text, Heading } from '@chakra-ui/react';
import { IPost } from '../../interfaces';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import { BiComment } from 'react-icons/bi';
import { BsBookmark, BsThreeDots } from 'react-icons/bs';
import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface IPostProps {
  postStyle: string;
  post: IPost;
  upVotePost: (postId: number, action: string) => Promise<void>;
  downVotePost: (postId: number, action: string) => Promise<void>;
}

const Post = ({ postStyle, post, upVotePost, downVotePost }: IPostProps) => {
  const handleUpVotePost = async (
    e: MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    await upVotePost(postId, action);
  };

  const handleDownVotePost = async (
    e: MouseEvent<HTMLDivElement>,
    postId: number,
    action: string
  ) => {
    e.stopPropagation();
    await downVotePost(postId, action);
  };

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
              <Box cursor="pointer" alignItems="center" mx="1rem" display="flex">
                <BsBookmark color="#8a8f9d" fontSize="1rem" />
                <Text color="text.primary" ml="0.5rem" role="button" cursor="pointer">
                  Save
                </Text>
              </Box>
              <Box cursor="pointer" display="flex" alignItems="center" mx="1rem">
                <BsThreeDots color="#8a8f9d" fontSize="1rem" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Post;
