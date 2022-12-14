import { Box, Text } from '@chakra-ui/react';
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { FiSettings, FiUsers } from 'react-icons/fi';
import { BsList, BsChevronLeft, BsBookmark } from 'react-icons/bs';
import { TbLogout } from 'react-icons/tb';
import {
  AiOutlineFileAdd,
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineBell,
  AiOutlineMail,
  AiOutlineUser,
} from 'react-icons/ai';
import AuthMenuLink from './AuthMenuLink';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import {
  ICommunity,
  ICommunityContext,
  IAuthorCommunityResponse,
  IUserContext,
} from '../../interfaces';
import { CommunityContext } from '../../context/community';
import CommunityList from '../Community/CommunityList';
import { UserContext } from '../../context/user';
import { BiIdCard } from 'react-icons/bi';

const AuthMenu = () => {
  const { user, tokens, logout } = useContext(UserContext) as IUserContext;
  const {
    handleSetCommunities,
    menuHasNextPage,
    menuCurrentPage,
    setMenuCurrentPage,
    setMenuHasNextPage,
    communities,
    resetCommunities,
  } = useContext(CommunityContext) as ICommunityContext;
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState('nav');

  const handleSetCurrentPage = (label: string) => {
    setCurrentPage(label);
    setMenuOpen(false);
  };

  const clickAway = useCallback((e: MouseEvent) => {
    const target = e.target as Element;
    if (menuRef.current !== null && triggerRef.current) {
      if (!menuRef.current.contains(target) && !triggerRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const handleMenuView = (e: ReactMouseEvent<HTMLDivElement>, view: string) => {
    e.stopPropagation();
    setMenuView(view);
    if (view === 'nav') {
      setMenuOpen(false);
    }
  };

  const fetchCommunities = async (endpoint: string) => {
    try {
      const response = await http.get<IAuthorCommunityResponse>(endpoint);
      handleSetCommunities(response.data.communities);
      setMenuCurrentPage(response.data.page);
      setMenuHasNextPage(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    fetchCommunities('/community/?page=0');
  });

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
      cursor="pointer"
      ref={triggerRef}
      onClick={() => setMenuOpen(true)}
      mt={['1rem', 0, 0]}
      ml={[0, '1.5rem', '1.5rem']}
      border="1px solid"
      borderColor="blue.tertiary"
      borderRadius="3px"
      height="35px"
      color="text.primary"
      width="200px"
      flexDir={['column', 'column', 'row']}
      position="relative"
    >
      <Text fontSize="0.9rem">{currentPage}</Text>
      {menuOpen && (
        <Box
          ref={menuRef}
          position="absolute"
          top={menuView === 'side' ? '70px' : '45px'}
          borderRadius="3px"
          left={menuView === 'side' ? '-80px' : '0'}
          minH={menuView === 'side' ? '100vh' : '400px'}
          zIndex="5"
          width={menuView === 'side' ? '320px' : '200px'}
          bg="blue.tertiary"
        >
          {menuView === 'nav' ? (
            <Box
              onClick={(e) => handleMenuView(e, 'side')}
              cursor="pointer"
              p="0.5rem"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <BsList />
              <BsChevronLeft />
            </Box>
          ) : (
            <Box
              onClick={(e) => handleMenuView(e, 'nav')}
              cursor="pointer"
              p="0.5rem"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <AiOutlineClose />
            </Box>
          )}
          <Box textAlign="left" display="flex" flexDir="column">
            <Text p="1rem" fontSize="0.75rem" textTransform="uppercase">
              feeds
            </Text>
            <Box p="0 1rem 1rem 1rem">
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal"
                label="Home"
                icon={AiOutlineHome}
              />
            </Box>
            <Text p="1rem" fontSize="0.75rem" textTransform="uppercase">
              other
            </Text>

            <Box p="0 1rem 1rem 1rem">
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/settings/account"
                label="User Settings"
                icon={FiSettings}
              />
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url={`/redal/profile/${user.id}`}
                label="Profile"
                icon={BiIdCard}
              />

              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url={`/redal/friends/${user.id}`}
                label="Friends"
                icon={FiUsers}
              />

              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url={`/redal/requests/${user.id}`}
                label="Requests"
                icon={AiOutlineUser}
              />

              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/create-community"
                label="Create Community"
                icon={AiOutlinePlus}
              />
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/create-post"
                label="Create Post"
                icon={AiOutlineFileAdd}
              />
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/bookmarks"
                label="Bookmarks"
                icon={BsBookmark}
              />

              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/notifications"
                label="Notifications"
                icon={AiOutlineBell}
              />
              <AuthMenuLink
                handleSetCurrentPage={handleSetCurrentPage}
                url="/redal/invites"
                label="Invites"
                icon={AiOutlineMail}
              />

              <Box
                cursor="pointer"
                p="0.5rem"
                onClick={logoutUser}
                display="flex"
                alignItems="center"
              >
                <TbLogout color="#fff" />
                <Text
                  color="text.primary"
                  fontSize="0.85rem"
                  ml="0.25rem"
                  p="0.25rem"
                  textAlign="left"
                >
                  Logout
                </Text>
              </Box>
            </Box>
            <Text p="1rem" fontSize="0.75rem" textTransform="uppercase">
              Communities
            </Text>
            {communities.length > 0 && <CommunityList communities={communities} />}
            {menuHasNextPage && (
              <Text
                role="button"
                onClick={() => fetchCommunities(`/community/?page=${menuCurrentPage}`)}
                cursor="pointer"
                fontSize="0.8rem"
                p="0 1rem 1rem 1rem"
              >
                See more
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AuthMenu;
