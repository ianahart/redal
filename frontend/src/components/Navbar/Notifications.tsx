import { AiFillBell, AiOutlineClose } from 'react-icons/ai';
import { Button, Box, Text, Image } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { http } from '../../helpers/utils';
import { retreiveTokens } from '../../helpers/utils';
import { UserContext } from '../../context/user';
import { IUserContext, INotification } from '../../interfaces';
import { useEffectOnce } from '../../hooks/UseEffectOnce';

const Notifications = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      if (menuRef.current !== null && triggerRef.current !== null) {
        if (!menuRef.current.contains(target) && triggerRef.current !== target) {
          setDropDownOpen(false);
        }
      }
    },
    [setDropDownOpen]
  );

  useEffectOnce(() => {
    fetchNotifications('/notifications/?page=0');
  });

  const fetchNotifications = async (endpoint: string) => {
    try {
      const response = await http.get(endpoint);
      setNotificationsCount(response.data.notifications_count);
      setNotifications((prevState) => [...prevState, ...response.data.notifications]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const socketUrl = `ws://127.0.0.1:8000/ws/notification/${user.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const {} = useWebSocket(socketUrl, {
    share: true,
    onMessage: (event: WebSocketEventMap['message']) => {
      const data = JSON.parse(event.data);
      if (Object.keys(data).includes('notification')) {
        setNotifications([]);
        setNotifications((prevState) => [
          ...prevState,
          ...data.notification.notifications,
        ]);
        setPage(data.notification.page);
        setHasNext(data.notification.has_next);
        setNotificationsCount((prevState) => prevState + 1);
      }
    },
  });

  const removeNotification = async (notificationId: number) => {
    console.log(notificationId);
    try {
      const filtered = notifications.filter(
        (notification) => notification.id !== notificationId
      );
      setNotifications(filtered);
      setNotificationsCount((prevState) => prevState - 1);
      await http.delete(`/notifications/${notificationId}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box
      onClick={() => setDropDownOpen(true)}
      position="relative"
      cursor="pointer"
      ref={triggerRef}
      mx="1rem"
    >
      <AiFillBell pointerEvents="none" fontSize="1.5rem" color="#8a8f9d" />
      {notificationsCount > 0 && (
        <Box
          position="absolute"
          pointerEvents="none"
          bg="red.primary"
          top="-15px"
          left="-15px"
          width="24px"
          height="24px"
          borderRadius="3px"
          color="#fff"
        >
          {notificationsCount > 9 ? '9+' : notificationsCount}
        </Box>
      )}
      {dropDownOpen && (
        <Box
          className="overflow-scroll"
          position="absolute"
          zIndex="4"
          padding="0.25rem"
          top="40px"
          borderRadius="3px"
          left="-200px"
          bg="blue.tertiary"
          width="300px"
          wordBreak="break-all"
          height="150px"
          overflowY="auto"
          ref={menuRef}
        >
          {notifications.length > 0 && (
            <Box>
              {notifications.map((notification) => {
                return (
                  <Box
                    _hover={{ background: 'blue.secondary' }}
                    my="1rem"
                    key={notification.id}
                  >
                    <Box justifyContent="center" display="flex">
                      {notification.avatar_url !== null && (
                        <Image
                          mr="0.5rem"
                          height="30px"
                          width="30px"
                          borderRadius="50%"
                          src={notification.avatar_url}
                          alt="profile picture"
                        />
                      )}
                      <Text width="170px" color="text.primary" fontSize="0.85rem">
                        {notification.text}
                      </Text>
                      <Box
                        onClick={() => removeNotification(notification.id)}
                        cursor="pointer"
                        mx="0.25rem"
                      >
                        <AiOutlineClose color="#fff" />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
          {hasNext && (
            <Box>
              <Button
                onClick={() => fetchNotifications(`/notifications/?page=${page}`)}
                type="submit"
                _hover={{ background: 'transparent', opacity: 0.8 }}
                bg="transparent"
                color="#fff"
                width="80%"
                margin="0 auto"
              >
                See more
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Notifications;
