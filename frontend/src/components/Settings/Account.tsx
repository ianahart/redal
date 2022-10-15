import { Box, Button, Text, Select } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { http } from '../../helpers/utils';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { BsChevronDown, BsTrash } from 'react-icons/bs';
import { nanoid } from 'nanoid';
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
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext) as IUserContext;
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { resetCommunities } = useContext(CommunityContext) as ICommunityContext;
  const [account, setAccount] = useState(accountSettingsState);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const genders = ['Man', 'Woman', 'Non-Binary', 'I prefer not to say'];
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

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setAccount((prevState) => ({
        ...prevState,
        country: e.target.value,
      }));
      const response = await http.patch('/account/settings/country/' + user.id + '/', {
        country: e.target.value,
      });
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

  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      if (menuRef.current !== null && triggerRef.current !== null) {
        if (!menuRef.current.contains(target) && triggerRef.current !== target) {
          setMenuOpen(false);
        }
      }
    },
    [setMenuOpen]
  );
  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const updateGender = async (
    e: React.MouseEvent<HTMLParagraphElement>,
    gender: string
  ) => {
    try {
      e.stopPropagation();
      setAccount((prevState) => ({
        ...prevState,
        gender,
      }));

      const response = await http.patch(`/account/settings/gender/${user.id}/`, {
        gender,
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const deleteAccount = async (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      e.stopPropagation();
      const response = await http.delete(`/account/${user.id}/`);
      logout();
      resetCommunities();

      navigate('/');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
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
          <Box
            ref={triggerRef}
            onClick={() => setMenuOpen(true)}
            position="relative"
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            <Text pointerEvents="none" mr="0.25rem">
              {account.gender === null ? 'Gender' : account.gender}
            </Text>
            <BsChevronDown />
            {menuOpen && (
              <Box
                position="absolute"
                top="25px"
                left="0"
                bg="blue.tertiary"
                width="150px"
                textAlign="left"
                borderRadius="3px"
                ref={menuRef}
              >
                {genders.map((gender) => {
                  return (
                    <Box
                      borderBottom="1px solid"
                      borderColor="#4e4e50"
                      p="0.25rem"
                      cursor="pointer"
                      key={nanoid()}
                    >
                      <Text onClick={(e) => updateGender(e, gender)}>{gender}</Text>
                    </Box>
                  );
                })}
              </Box>
            )}
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
            <Select
              value={account.country}
              onChange={handleSelectChange}
              ml="0.5rem"
              mt="1rem"
              borderColor="text.primary"
              width="50%"
            >
              {countries.map((country, index) => {
                return (
                  <option key={nanoid()} value={country}>
                    {country}
                  </option>
                );
              })}
            </Select>
          </Box>
        </Box>
        <Box p="0.5rem" pb="3rem">
          <MainHeading mainHeader="" subHeader="Delete Account" />
        </Box>
        <Box display="flex" justifyContent="flex-end" pb="2rem">
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={deleteAccount}
          >
            <BsTrash color="red" />
            <Button
              background="transparent"
              color="red"
              _hover={{ background: 'transparent' }}
            >
              DELETE ACCOUNT
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;
