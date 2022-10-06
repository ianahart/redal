import { Box, Heading, Button, Text, Image } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { http } from '../helpers/utils';
import { INotification } from '../interfaces';

import { useEffectOnce } from '../hooks/UseEffectOnce';
import { AiOutlineClose } from 'react-icons/ai';

const NotificationsPage = () => {
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchNotifications = async (endpoint: string) => {
    try {
      const response = await http.get(endpoint);
      setNotifications((prevState) => [...prevState, ...response.data.notifications]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    fetchNotifications('/notifications/?page=0');
  });

  const removeNotification = async (notificationId: number) => {
    try {
      const filtered = notifications.filter(
        (notification) => notification.id !== notificationId
      );
      setNotifications(filtered);
      await http.delete(`/notifications/${notificationId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box minH="100vh">
      <Box
        bg="blue.secondary"
        minH="600px"
        m="5rem auto 2rem auto"
        borderRadius="3px"
        width={['95%', '95%', '600px']}
      >
        <Box pt="1.5rem">
          <Heading
            m="0 auto"
            width={['95%', '95%', '400px']}
            borderBottom="1px solid"
            color="text.primary"
          >
            Notifications
          </Heading>
        </Box>
        {notifications.length === 0 && (
          <Text mt="1rem" color="text.primary">
            You currently do not have any notifications
          </Text>
        )}
        {notifications.map((notification) => {
          return (
            <Box
              display="flex"
              justifyContent="space-between"
              my="2rem"
              bg="blue.tertiary"
              p="0.5rem"
              key={notification.id}
            >
              <Box display="flex" alignItems="center">
                {notification.avatar_url !== null && (
                  <Image
                    mr="0.5rem"
                    width="40px"
                    height="40px"
                    borderRadius="50%"
                    src={notification.avatar_url}
                    alt="profile picture"
                  />
                )}
                <Text color="text.primary">{notification.text}</Text>
              </Box>
              <Box cursor="pointer" onClick={() => removeNotification(notification.id)}>
                <AiOutlineClose color="gray" fontSize="1.5rem" />
              </Box>
            </Box>
          );
        })}
        {hasNext && (
          <Box>
            <Button
              onClick={() => fetchNotifications(`/notifications/?page=${page}`)}
              _hover={{ background: 'blue.quatenary', opacity: 0.8 }}
              bg="blue.quatenary"
              color="#fff"
              width={['90%', '90%', '60%']}
              margin="0 auto"
            >
              See more
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
