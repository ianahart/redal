import { Text, Box, Image } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TbLogout } from 'react-icons/tb';
import { FiSettings } from 'react-icons/fi';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { UserContext } from '../../context/user';
import { ICommunityContext, IUserContext } from '../../interfaces';
import Searchbar from './Searchbar';
import logo from '../../images/logo.png';
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai';
import AuthMenu from './AuthMenu';
import { CommunityContext } from '../../context/community';
import Notifications from './Notifications';

const AuthNavbar = () => {
  const { resetCommunities } = useContext(CommunityContext) as ICommunityContext;
  const { user, tokens, logout } = useContext(UserContext) as IUserContext;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (menuRef.current !== null) {
      if (!menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const logoutUser = async () => {
    try {
      await http.post('/auth/logout/', {
        id: user.id,
        refresh_token: tokens.refresh_token,
      });
      logout();
      setMenuOpen(false);
      resetCommunities();
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDir={['column', 'column', 'row']}
      justifyContent="space-around"
      width="100%"
      bg="blue.secondary"
      height="70px"
    >
      <Box
        display="flex"
        flexDir={['column', 'column', 'row']}
        alignItems={['flex-start', 'flex-start', 'center']}
        justifyContent="space-between"
        as="nav"
        width="100%"
      >
        <Box justifyContent="space-between" display="flex" alignItems="center">
          <Image
            ml="1rem"
            borderRadius="8px"
            width="40px"
            height="40px"
            src={logo}
            alt="logo"
          />
          <AuthMenu />
        </Box>
        <Box
          mt={['2rem', 0, 0]}
          flexDir={['column', 'column', 'row']}
          display={['none', 'none', 'flex']}
          alignItems="center"
        >
          <Searchbar />
          <Notifications />
          <Box
            onClick={() => setMenuOpen(true)}
            height="50px"
            mt={['1rem', '1rem', 0]}
            mb={['1rem', '1rem', 0]}
            width="50px"
            color="#fff"
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
            ml="2rem"
            borderRadius="50%"
            bg={!user.avatar_url ? user.color : 'none'}
            backgroundImage={user.avatar_url ? `url(${user.avatar_url})` : ''}
            backgroundSize={user.avatar_url ? 'cover' : ''}
            mr="1.5rem"
            position="relative"
            ref={menuRef}
          >
            {!user.avatar_url && <Text m="0">{user.initials}</Text>}
            {menuOpen && (
              <Box
                position="absolute"
                zIndex="5"
                top="50px"
                right="50px"
                borderRadius="3px"
                width="180px"
                boxShadow="md"
                bg="blue.tertiary"
                minH="320px"
              >
                <Box display="flex" flexDir="column">
                  <Box>
                    <Text borderBottom="1px solid" borderColor="text.primary">
                      {user.first_name}
                    </Text>
                  </Box>

                  <Box p="0.5rem" display="flex" alignItems="center">
                    <Box mr="0.5rem">
                      <AiOutlineHome color="#fff" />
                    </Box>
                    <RouterLink to="/redal" color="#fff">
                      Home
                    </RouterLink>
                  </Box>
                  <Box p="0.5rem" display="flex" alignItems="center">
                    <Box mr="0.5rem">
                      <FiSettings color="#fff" />
                    </Box>
                    <RouterLink to="/redal/settings/account" color="#fff">
                      User Settings
                    </RouterLink>
                  </Box>

                  <Box p="0.5rem" onClick={logoutUser} display="flex" alignItems="center">
                    <TbLogout color="#fff" />
                    <Text ml="0.25rem" p="0.25rem" textAlign="left" color="#fff">
                      Logout
                    </Text>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthNavbar;
