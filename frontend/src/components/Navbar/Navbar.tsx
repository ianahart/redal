import { Text, Box, UnorderedList } from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import Searchbar from './Searchbar';
import ListItems from './ListItems';
import { useCallback, useEffect, useState } from 'react';
import MobileNav from './MobileNav';
const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSetMobileNavOpen = useCallback((open: boolean) => {
    setMobileNavOpen(open);
  }, []);

  const handleResize = useCallback(
    (event: Event) => {
      const target = event.target as Window;
      if (target.innerWidth > 850) {
        handleSetMobileNavOpen(false);
      }
    },
    [handleSetMobileNavOpen]
  );
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <Box width="100%" bg="blue.secondary" height="70px">
      <Box position="relative" className="mobileNav">
        <Box
          onClick={() => setMobileNavOpen(true)}
          border="1px solid #8a8f9d"
          borderRadius="3px"
          padding="0.25rem"
          cursor="pointer"
        >
          <GiHamburgerMenu color="#8a8f9d" fontSize="1.5rem" />
          {mobileNavOpen && <MobileNav handleSetMobileNavOpen={handleSetMobileNavOpen} />}
        </Box>
      </Box>
      <Box as="nav" className="mainNav">
        <Box></Box>
        <UnorderedList display="flex" alignItems="center" listStyleType="none">
          <ListItems />
        </UnorderedList>
        <Box display="flex" alignItems="center">
          <Searchbar />
          <Text>Logo</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
