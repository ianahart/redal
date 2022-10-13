import { Box, Text, Image } from '@chakra-ui/react';
import { useContext } from 'react';
import { UserContext } from '../../context/user';
import { IMessage, IUserContext } from '../../interfaces';

interface IMessageProps {
  message: IMessage;
}

const Message = ({ message }: IMessageProps) => {
  const { user } = useContext(UserContext) as IUserContext;
  return (
    <Box ml={user.id === message.user.id ? 'auto' : 0} my="2rem">
      <Box display="flex">
        {message.user.avatar_url !== null ? (
          <Image
            width="40px"
            height="40px"
            borderRadius="50%"
            src={message.user.avatar_url}
            alt="profile avatar"
          />
        ) : (
          <Box
            bg={message.user.color}
            display="flex"
            color="#fff"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            width="40px"
            height="40px"
          >
            {message.user.initials}
          </Box>
        )}
        <Text ml="0.5rem" fontSize="0.85rem">
          {message.user.first_name} {message.user.last_name}
        </Text>
      </Box>
      <Box p="0.5rem" borderRadius="20px" mt="0.5rem" width="250px" bg="blue.quatenary">
        <Text wordBreak="break-all" fontSize="0.8rem">
          {message.text}
        </Text>
      </Box>
    </Box>
  );
};

export default Message;
