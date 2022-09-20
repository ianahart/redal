import { Box, Heading, Text } from '@chakra-ui/react';

interface IMainHeadingProps {
  mainHeader: string;
  subHeader: string;
}

const MainHeading = ({ mainHeader, subHeader }: IMainHeadingProps) => {
  return (
    <Box>
      <Heading textAlign="left" mb="2.5rem" fontSize="1.5rem" as="h3">
        {mainHeader}
      </Heading>
      <Text
        width={['100%', '90%', '520px']}
        fontSize="0.8rem"
        textAlign="left"
        borderBottom="1px solid"
        borderColor="text.primary"
        textTransform="uppercase"
      >
        {subHeader}
      </Text>
    </Box>
  );
};

export default MainHeading;
