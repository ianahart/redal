import { Box, Text } from '@chakra-ui/react';
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { FiSettings } from 'react-icons/fi';
import { BsList, BsChevronLeft } from 'react-icons/bs';

import {
  AiOutlineFileAdd,
  AiOutlineHome,
  AiOutlinePlus,
  AiOutlineClose,
} from 'react-icons/ai';
import AuthMenuLink from './AuthMenuLink';

const AuthMenu = () => {
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
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AuthMenu;
