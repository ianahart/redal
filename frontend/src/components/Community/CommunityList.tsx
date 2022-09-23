import { Box, Image, Text } from '@chakra-ui/react';
import { ICommunity } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
interface ICommunityListProps {
  communities: ICommunity[];
}

const CommunityList = ({ communities }: ICommunityListProps) => {
  const navigate = useNavigate();
  const navigateToCommunity = (slug: string, id: number) => {
    navigate(`/redal/${slug}`, { state: { id } });
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      height="100px"
      overflowY="auto"
      className="overflow-scroll"
    >
      {communities.map((community) => {
        return (
          <Box
            onClick={() => navigateToCommunity(community.slug, community.id)}
            key={community.id}
            display="flex"
            p="0 1rem 1rem 1rem"
            alignItems="center"
          >
            <Image
              width="30px"
              height="30px"
              borderRadius="50%"
              src={community.image_url}
              alt={community.name}
            />
            <Text wordBreak="break-all" ml="0.25rem" fontSize="0.85rem">
              {community.name}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default CommunityList;
