import { Box, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';

const Settings = () => {
  const [activeView, setActiveView] = useState('account');

  return (
    <Box minH="100vh" color="text.primary">
      <Box
        bg="blue.secondary"
        borderRadius="3px"
        minH="100vh"
        margin="3rem auto"
        width={['95%', '95%', '75%']}
      >
        <Heading fontSize="1.2rem" textAlign="left" m="2rem" pt="2rem">
          User Settings
        </Heading>
        <Box m="1rem" display="flex" justifyContent="flex-start">
          <Box onClick={() => setActiveView('account')}>
            <RouterLink to="/redal/settings/account">
              <Text className={activeView === 'account' ? 'borderBottom' : ''} m="1rem">
                Account
              </Text>
            </RouterLink>
          </Box>
          <Box onClick={() => setActiveView('profile')}>
            <RouterLink to="/redal/settings/profile">
              <Text className={activeView === 'profile' ? 'borderBottom' : ''} m="1rem">
                Profile
              </Text>
            </RouterLink>
          </Box>
          <Box onClick={() => setActiveView('notifications')}>
            <RouterLink to="/redal/settings/notifications">
              <Text
                className={activeView === 'notifications' ? 'borderBottom' : ''}
                m="1rem"
              >
                Notifications
              </Text>
            </RouterLink>
          </Box>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Settings;
