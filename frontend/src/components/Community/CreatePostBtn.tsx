import { Box, Image, Text } from '@chakra-ui/react';
import { ICommunity } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
import { BsLink, BsImage } from 'react-icons/bs';
import { MouseEvent } from 'react';

interface ICreatePostBtnProps {
  avatar_url: string | null;
  initials: string;
  color: string;
  community: ICommunity;
}

const CreatePostBtn = ({
  avatar_url,
  initials,
  color,
  community,
}: ICreatePostBtnProps) => {
  const navigate = useNavigate();

  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate('/redal/create-post', { state: community });
  };

  return (
    <Box
      onClick={handleOnClick}
      display="flex"
      justifyContent="space-evenly"
      cursor="pointer"
      alignItems="center"
      minH="50px"
      width="100%"
      borderRadius="3px"
      p="0.25rem"
      bg="#fff"
      border="1px solid"
      borderColor="border.primary"
    >
      {avatar_url ? (
        <Image
          borderRadius="50%"
          width="45px"
          height="45px"
          src={avatar_url}
          alt={initials}
        />
      ) : (
        <Box
          display="flex"
          flexDir="column"
          bg={color}
          width="45px"
          height="45px"
          color="#fff"
          alignItems="center"
          borderRadius="50%"
          justifyContent="center"
        >
          {initials}
        </Box>
      )}
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        borderRadius="3px"
        height="40px"
        color="text.primary"
        width="70%"
        border="1px solid"
        borderColor="border.primary"
      >
        Create Post
      </Box>
      <BsImage color="#8a8f9d" fontSize="1.5rem" />
      <BsLink color="#8a8f9d" fontSize="1.5rem" />
    </Box>
  );
};

export default CreatePostBtn;
