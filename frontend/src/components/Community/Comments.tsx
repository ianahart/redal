import {
  Menu,
  Button,
  Portal,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user';
import { http } from '../../helpers/utils';
import { ICommentsResponse, IUserContext, IComment } from '../../interfaces';
import { retreiveTokens } from '../../helpers/utils';
import useWebSocket from 'react-use-websocket';
import Comment from './Comment';
interface ICommentProps {
  postId: number;
  authorId: number;
}

const Comments = ({ postId, authorId }: ICommentProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  const [sort, setSort] = useState('new');
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const name = user.display_name
    ? user.display_name
    : user.first_name + ' ' + user.last_name;

  const fetchComments = async (endpoint: string, sort: string) => {
    try {
      setComments([]);
      setSort(sort);
      setHasNext(false);
      setPage(0);
      const response = await http.get<ICommentsResponse>(endpoint);
      setComments(response.data.comments);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const loadMore = async () => {
    try {
      const response = await http.get<ICommentsResponse>(
        `/comments/?page=${page}&sort=${sort}&postId=${postId}`
      );
      setComments((prevState) => [...prevState, ...response.data.comments]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffect(() => {
    if (postId !== 0) {
      fetchComments('/comments/?page=0&sort=new&postId=' + postId, 'new');
    }
  }, [postId]);

  const handleOnTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const socketUrl = `wss://redal.herokuapp.com/ws/notification/${user.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
    onMessage: async (event: WebSocketEventMap['message']) => {
      await fetchComments('/comments/?page=0&sort=new&postId=' + postId, 'new');
    },
  });

  const addComment = () => {
    try {
      if (!inputValue.trim().length) return;
      sendJsonMessage({
        message: { user: user.id, author: authorId, post: postId, text: inputValue },
      });
      setInputValue('');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  const handleUnlike = (commentId: number) => {
    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        comment.like_id = null;
        comment.like_count = comment.like_count - 1;
      }
      return comment;
    });
    setComments(updated);
  };

  const handleLike = (likeId: number, commentId: number) => {
    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        comment.like_id = likeId;
        comment.like_count = comment.like_count + 1;
      }
      return comment;
    });
    setComments(updated);
  };

  return (
    <Box display="flex" mx="2rem" justifyContent="flex-start">
      <Box display="flex" width="100%" flexDir="column">
        <FormLabel color="text.primary" fontSize="0.85rem">
          Commenting as {name}
        </FormLabel>
        <Textarea
          onChange={handleOnTextareaChange}
          value={inputValue}
          width="100%"
        ></Textarea>
        <Box textAlign="left" my="2rem">
          <Menu>
            <MenuButton color="blue.quatenary">Sort by: {sort}</MenuButton>
            <Portal>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    fetchComments(`/comments/?page=0&sort=new&post=${postId}`, 'new')
                  }
                >
                  New
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    fetchComments(`/comments/?page=0&sort=old&post=${postId}`, 'old')
                  }
                >
                  Old
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    fetchComments(`/comments/?page=0&sort=top&post=${postId}`, 'top')
                  }
                >
                  Top
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
        <Box textAlign="right">
          <Button
            onClick={addComment}
            _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
            bg="blue.quatenary"
            color="#fff"
            width="50%"
          >
            Add comment
          </Button>
        </Box>
        <Box>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment.id}
                fetchComments={fetchComments}
                handleUnlike={handleUnlike}
                handleLike={handleLike}
                postId={postId}
                comment={comment}
                user={user}
              />
            );
          })}
        </Box>
        {hasNext && (
          <Box>
            <Button
              cursor="pointer"
              onClick={loadMore}
              _hover={{ background: 'transparent', opacity: 0.8 }}
              bg="transparents"
              color="text.primary"
              width="80%"
              margin="0 auto"
            >
              More Comments
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comments;
