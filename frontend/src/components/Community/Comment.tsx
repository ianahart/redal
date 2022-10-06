import { Box, Text, Image, Tooltip } from '@chakra-ui/react';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import { AxiosError } from 'axios';
import { FiTrash } from 'react-icons/fi';
import { http } from '../../helpers/utils';
import { IComment, IUser } from '../../interfaces';

interface ICommentProps {
  comment: IComment;
  user: IUser;
  postId: number;
  fetchComments: (endpoint: string, sort: string) => Promise<void>;
  handleUnlike: (commentId: number) => void;
  handleLike: (likeId: number, commentId: number) => void;
}

const Comment = ({
  comment,
  user,
  postId,
  fetchComments,
  handleUnlike,
  handleLike,
}: ICommentProps) => {
  const deleteComment = async () => {
    try {
      await http.delete(`/comments/${comment.id}/`);
      await fetchComments('/comments/?page=0&sort=new&postId=' + postId, 'new');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const addLike = async (comment: number) => {
    try {
      const response = await http.post('/likes/', { comment });
      handleLike(response.data.like.id, response.data.like.comment);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const unlike = async (commentId: number, likeId: number) => {
    try {
      await http.delete(`/likes/${likeId}`);
      handleUnlike(commentId);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const handleLikeOperation = async (comment: IComment) => {
    try {
      if (!comment.like_id) {
        await addLike(comment.id);
      } else {
        unlike(comment.id, comment.like_id);
      }
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box
      my="1rem"
      border="1px solid"
      borderColor="border.primary"
      borderRadius="8px"
      minH="100px"
    >
      <Box display="flex">
        <Box p="0.25rem">
          {comment.user.avatar_url !== null ? (
            <Image
              width="40px"
              height="40px"
              borderRadius="50%"
              src={comment.user.avatar_url}
              alt={comment.user.first_name}
            />
          ) : (
            <Box
              width="40px"
              height="40px"
              borderRadius="50%"
              display="flex"
              flexDir="column"
              bg={comment.user.color}
              color="#fff"
              alignItems="center"
              justifyContent="center"
            >
              {comment.user.initials}
            </Box>
          )}
        </Box>
        <Box display="flex">
          <Box>
            <Text color="text.primary" fontSize="0.85rem">
              {comment.user.display_name
                ? comment.user.display_name
                : comment.user.first_name + ' ' + comment.user.last_name}
            </Text>
            <Text color="text.primary" fontSize="0.85rem">
              {comment.readable_date}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box textAlign="left" m="1rem" color="text.primary" fontSize="0.85rem">
        {comment.text}
      </Box>
      <Box display="flex" justifyContent="space-between" my="1rem">
        <Box display="flex">
          <Box
            onClick={() => handleLikeOperation(comment)}
            cursor="pointer"
            mx="1.5rem"
            display="flex"
            alignItems="center"
          >
            <Text color="blue.quatenary">
              {comment.like_count > 0 ? comment.like_count : ''}
            </Text>
            <Box transform={comment.like_id !== null ? 'rotate(-10deg)' : ''}>
              <AiOutlineLike
                color={comment.like_id !== null ? '#0080FF' : '#8a8f9d'}
                fontSize="1.5rem"
              />
            </Box>
            <Text
              fontWeight={comment.like_id !== null ? 'bold' : 'normal'}
              color={comment.like_id !== null ? '#0080FF' : '#8a8f9d'}
              fontSize="0.85rem"
            >
              {comment.like_id !== null ? 'Unlike' : 'Like'}
            </Text>
          </Box>
          <Box mx="1.5rem" display="flex" alignItems="center">
            <AiOutlineComment color="#8a8f9d" fontSize="1.5rem" />
            <Text color="text.primary" fontSize="0.85rem">
              Reply
            </Text>
          </Box>
        </Box>
        {user.id === comment.user.id && (
          <Tooltip label="Delete" placement="auto-end">
            <Box cursor="pointer" onClick={deleteComment}>
              <FiTrash color="8a8f9d" fontSize="1.5rem" />
            </Box>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
export default Comment;
