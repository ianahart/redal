import { Box } from '@chakra-ui/react';
import MainHeading from './MainHeading';
const Notifications = () => {
  return (
    <Box>
      <Box mt="1.5rem" ml="2rem" display="flex" justify-content="flex-start">
        <MainHeading mainHeader="Notification settings" subHeader="messages" />
      </Box>
    </Box>
  );
};

export default Notifications;
