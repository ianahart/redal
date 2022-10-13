import { Box, Switch, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user';
import { http } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';
import MainHeading from './MainHeading';
const Notifications = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [notificationsSwitchChecked, setNotificationsSwitchChecked] = useState(true);
  const [messagesSwitchChecked, setMessagesSwitchChecked] = useState(true);

  useEffect(() => {
    setNotificationsSwitchChecked(user.setting_user.notifications_on);
  }, [user.id, user.setting_user.notifications_on]);

  useEffect(() => {
    console.log(user.setting_user.messages_on);
    setMessagesSwitchChecked(user.setting_user.messages_on);
  }, [user.id, user.setting_user.messages_on]);

  const toggleNotificationsSwitch = async () => {
    setNotificationsSwitchChecked((prevState) => !prevState);
    try {
      const response = await http.patch(
        `/settings/notifications/${user.setting_user.id}/`,
        {
          notifications_on: !notificationsSwitchChecked,
        }
      );
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const toggleMessageSwitch = async () => {
    setMessagesSwitchChecked((prevState) => !prevState);
    try {
      const response = await http.patch(`/settings/messages/${user.setting_user.id}/`, {
        messages_on: !messagesSwitchChecked,
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box>
      <Box
        my="2em"
        ml="2rem"
        flexDir="column"
        alignItems="flex-start"
        display="flex"
        justify-content="flex-start"
      >
        <MainHeading mainHeader="Message settings" subHeader="messages" />
        <Box mt="1.5rem" display="flex">
          <Text>Messages {messagesSwitchChecked ? 'On' : 'Off'}</Text>
          <Switch
            onChange={toggleMessageSwitch}
            ml="1.5rem"
            size="lg"
            isChecked={messagesSwitchChecked}
          />
        </Box>
      </Box>
      <Box
        my="2rem"
        ml="2rem"
        display="flex"
        flexDir="column"
        alignItems="flex-start"
        justify-content="flex-start"
      >
        <MainHeading mainHeader="Notification settings" subHeader="Notifications" />
        <Box mt="1.5rem" display="flex">
          <Text>Notifications {notificationsSwitchChecked ? 'On' : 'Off'}</Text>
          <Switch
            onChange={toggleNotificationsSwitch}
            ml="1.5rem"
            size="lg"
            isChecked={notificationsSwitchChecked}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
