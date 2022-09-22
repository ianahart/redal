import { Box, Icon, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link as RouterLink } from 'react-router-dom';

interface IAuthMenuLinkProps {
  label: string;
  url: string;
  icon: IconType;
  handleSetCurrentPage: (label: string) => void;
}

const AuthMenuLink = ({ label, url, icon, handleSetCurrentPage }: IAuthMenuLinkProps) => {
  return (
    <Box
      onClick={() => handleSetCurrentPage(label)}
      p="0.5rem"
      display="flex"
      alignItems="center"
    >
      <Box mr="0.5rem">
        <Icon as={icon} color="#fff" />
      </Box>
      <RouterLink to={url} color="#fff">
        <Text fontSize="0.8rem">{label}</Text>
      </RouterLink>
    </Box>
  );
};

export default AuthMenuLink;
