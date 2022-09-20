import { Box } from '@chakra-ui/react';
import MainHeading from './MainHeading';
const Account = () => {
  return (
    <Box>
      <Box mt="1.5rem" ml="2rem" display="flex" justify-content="flex-start">
        <MainHeading mainHeader="Account Settings" subHeader="account preferences" />
      </Box>
    </Box>
  );
};

export default Account;
