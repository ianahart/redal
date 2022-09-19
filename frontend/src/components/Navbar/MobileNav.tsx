import { useCallback, useEffect, useRef } from 'react';
import { UnorderedList } from '@chakra-ui/react';
import MobileListItems from './MobileNavListItems';

interface IMobileNavProps {
  handleSetMobileNavOpen: (open: boolean) => void;
}

const MobileNav = ({ handleSetMobileNavOpen }: IMobileNavProps) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;
      if (target !== null) {
        if (!target.contains(menuRef.current)) {
          handleSetMobileNavOpen(false);
        }
      }
    },
    [handleSetMobileNavOpen]
  );

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  return (
    <UnorderedList
      ref={menuRef}
      position="absolute"
      right="50px"
      top="50px"
      background="blue.tertiary"
      width="180px"
      minH="180px"
      textAlign="left"
      boxShadow="lg"
      borderRadius="8px"
      margin="0"
      padding="0"
      listStyleType="none"
    >
      <MobileListItems />
    </UnorderedList>
  );
};

export default MobileNav;
