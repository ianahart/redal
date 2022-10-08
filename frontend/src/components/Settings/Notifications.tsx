import { Box, Switch, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/user';
import { http } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';
import MainHeading from './MainHeading';
const Notifications = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [switchChecked, setSwitchChecked] = useState(true);

  useEffect(() => {
    setSwitchChecked(user.setting_user.notifications_on);
  }, [user.id, user.setting_user.notifications_on]);

  const toggleNotificationsSwitch = async () => {
    console.log('test');
    setSwitchChecked((prevState) => !prevState);
    try {
      const response = await http.patch(
        `/settings/notifications/${user.setting_user.id}/`,
        {
          notifications_on: !switchChecked,
        }
      );
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  return (
    <Box>
      <Box my="2em" ml="2rem" display="flex" justify-content="flex-start">
        <MainHeading mainHeader="Message settings" subHeader="messages" />
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
          <Text>Notifications {switchChecked ? 'On' : 'Off'}</Text>
          <Switch
            onChange={toggleNotificationsSwitch}
            ml="1.5rem"
            size="lg"
            isChecked={switchChecked}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;
