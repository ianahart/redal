import { Box, Button, Text, Select } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import {
  IAccountSettingsResponse,
  ICommunityContext,
  IUserContext,
} from '../../interfaces';
import MainHeading from './MainHeading';
import { accountSettingsState, countries } from '../../helpers/data';
import EmailForm from './EmailForm';
import { UserContext } from '../../context/user';
import { retreiveTokens } from '../../helpers/utils';
import { CommunityContext } from '../../context/community';
const Account = () => {
  const { user, logout } = useContext(UserContext) as IUserContext;
  const { resetCommunities } = useContext(CommunityContext) as ICommunityContext;
  const [account, setAccount] = useState(accountSettingsState);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const fetchAccountSettings = async (endpoint: string) => {
    try {
      const response = await http.get<IAccountSettingsResponse>(endpoint);
      setAccount(response.data.account);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchAccountSettings('/account/settings/');
  });

  const handleOpenModal = (open: boolean) => {
    setModalOpen(open);
  };

  const changeEmail = async (value: string) => {
    try {
      const response = await http.patch('/account/settings/email/' + user.id + '/', {
        email: value,
        refresh_token: retreiveTokens().refresh_token,
      });
      handleOpenModal(false);
      logout();
      resetCommunities();
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setEmailError(err.response.data.email);
        return;
      }
    }
  };

  return (
    <Box>
      <Box mt="1.5rem" ml="2rem" display="flex" justify-content="flex-start">
        <MainHeading mainHeader="Account Settings" subHeader="account preferences" />
      </Box>
      <Box className="container" width={['90%', '90%', '550px']}>
        <Box mt="3rem" display="flex" alignItems="center" justifyContent="space-between">
          {modalOpen && (
            <Box
              bg="rgba(0, 0, 0, 0.75)"
              position="absolute"
              zIndex="3"
              width="100%"
              height="100%"
              left="0"
              top="0"
            >
              <EmailForm
                emailError={emailError}
                changeEmail={changeEmail}
                handleOpenModal={handleOpenModal}
              />
            </Box>
          )}
          <Box ml="0.5rem">
            <Text>Email Address</Text>
            <Text fontSize="0.85rem">{account.email}</Text>
          </Box>
          <Box>
            <Button
              onClick={() => handleOpenModal(true)}
              _hover={{ background: 'transparent' }}
              bg="transparent"
              borderRadius="20px"
              border="1px solid"
              borderColor="blue.tertiary"
            >
              Change
            </Button>
          </Box>
        </Box>
        <Box mt="3rem" display="flex" alignItems="center" justifyContent="space-between">
          <Box ml="0.5rem">
            <Text textAlign="left">Gender</Text>
            <Text textAlign="left" fontSize="0.85rem">
              Redal will never share this information and only uses it to improve the
              content you see.
            </Text>
          </Box>
          <Box>
            <Button>Gender</Button>
          </Box>
        </Box>
        <Box mt="3rem">
          <Box ml="0.5rem">
            <Text textAlign="left">Country</Text>
            <Text textAlign="left" fontSize="0.85rem">
              This is your primary location.
            </Text>
          </Box>
          <Box>
            <Select ml="0.5rem" mt="1rem" borderColor="text.primary" width="50%">
              {countries.map((country) => {
                return (
                  <option selected={account.country === country} value={country}>
                    {country}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
