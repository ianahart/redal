import {
  Box,
  Text,
  Textarea,
  FormLabel,
  Image,
  Heading,
  Button,
  Input,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { ChangeEvent, MouseEvent, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { http } from '../helpers/utils';
import {
  ICheckGroupResponse,
  IGroup,
  IMessage,
  IMessageResponse,
  IUserContext,
} from '../interfaces';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import Message from '../components/Message/Message';
import useWebSocket from 'react-use-websocket';
import { retreiveTokens } from '../helpers/utils';
import { UserContext } from '../context/user';

const Messages = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const location = useLocation();
  const [group, setGroup] = useState<IGroup>({ id: 0, user_one: 0, user_two: 0 });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [exclude, setExclude] = useState<number[]>([]);

  const fetchMessages = async (userId: number, friendId: number) => {
    try {
      const responseOne = await http.post<ICheckGroupResponse>('chat/groups/', {
        user_one: userId,
        user_two: friendId,
      });

      setGroup(responseOne.data.group);

      const responseTwo = await http.post<IMessageResponse>(
        `/chat/messages/?group_id=${responseOne.data.group.id}&page=0`,
        {
          exclude,
        }
      );
      setMessages((prevState) => [...prevState, ...responseTwo.data.messages]);
      setHasNext(responseTwo.data.has_next);
      setPage(responseTwo.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const loadMoreMessages = async () => {
    try {
      const response = await http.post(
        `/chat/messages/?group_id=${group.id}&page=${page}`,
        { exclude }
      );
      setMessages((prevState) => [...prevState, ...response.data.messages]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const socketUrl = `wss://redal.herokuapp.com/ws/chat/${group.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
    onMessage: async (event: WebSocketEventMap['message']) => {
      const data = JSON.parse(event.data);
      if (Object.keys(data).includes('message')) {
        setMessages((prevState) => [data.message, ...prevState]);
        setExclude((prevState) => [...prevState, data.message.id]);
      }
    },
  });

  useEffectOnce(() => {
    fetchMessages(location.state.userId, location.state.friendId);
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sendJsonMessage({ message: { user: user.id, text: message, group: group.id } });
    setMessage('');
  };

  return (
    <Box bg="blue.primary" minH="100vh">
      <Box
        width={['90%', '90%', '600px']}
        m="5rem auto 2rem auto"
        borderRadius="3px"
        bg="blue.secondary"
        minH="600px"
      >
        {hasNext && (
          <Box mt="1.5rem" onClick={loadMoreMessages} cursor="pointer">
            <Text color="#fff" fontSize="1rem">
              Previous messages
            </Text>
          </Box>
        )}

        <Box
          className="messages overflow-scroll"
          flexDir="column-reverse"
          display="flex"
          color="#fff"
          height="400px"
          overflowY="auto"
          p="0.5rem"
        >
          {messages.map((message) => {
            return <Message message={message} key={message.id} />;
          })}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" p="0.5rem">
          <Input
            onChange={handleOnChange}
            color="#fff"
            width="350px"
            placeholder="Send message"
            value={message}
            height="45px"
            borderColor="#555558"
            bg="transparent"
          />
          <Button
            onClick={sendMessage}
            width="150px"
            bg="text.primary"
            color="#fff"
            _hover={{ background: 'text.primary' }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Messages;
