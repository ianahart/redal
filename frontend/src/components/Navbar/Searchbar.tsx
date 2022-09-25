import { Box, Image, Input, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { debounce } from 'lodash';
import { useRef, ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { http } from '../../helpers/utils';
import { ICommunity, ISearchCommunityResponse } from '../../interfaces';

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = useCallback(
    debounce((value) => search(value), 200),
    []
  );

  const search = async (value: string) => {
    try {
      setCommunities([]);
      setSearchOpen(true);
      const response = await http.post<ISearchCommunityResponse>(
        '/community/search/?page=0',
        {
          value,
        }
      );
      if (response.data.communities.length === 0) {
        setSearchOpen(false);
      } else {
        setCommunities(response.data.communities);
      }
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setSearchOpen(false);
      }
    }
  };

  const seeMore = async (value: string) => {
    try {
      setSearchOpen(true);
      const response = await http.post<ISearchCommunityResponse>(
        '/community/search/?page=' + page,
        {
          value,
        }
      );
      setCommunities((prevState) => [...prevState, ...response.data.communities]);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const clickAway = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;

      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          setSearchOpen(false);
        }
      }
    },

    [setSearchOpen]
  );

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  const navigateToCommunity = (community: ICommunity) => {
    navigate(`/redal/${community.slug}`, { state: { community } });
  };

  return (
    <Box position="relative">
      <Input
        color="#fff"
        onChange={handleOnChange}
        value={searchInput}
        bg="blue.tertiary"
        border="none"
        placeholder="Search"
        paddingLeft="1.7rem"
      />
      <Box position="absolute" top="10px" left="5px">
        <BsSearch color="#8a8f9d" fontSize="1.2rem" />
      </Box>
      {searchOpen && (
        <Box
          className="overflow-scroll"
          ref={menuRef}
          position="absolute"
          boxShadow="lg"
          top="50px"
          left="0"
          width="250px"
          bg="blue.tertiary"
          wordBreak="break-all"
          overflowY="auto"
          height="160px"
        >
          {communities.map((community) => {
            return (
              <Box
                onClick={() => navigateToCommunity(community)}
                cursor="pointer"
                key={community.id}
                p="0.5rem 0.25rem"
                _hover={{ background: 'blue.secondary' }}
                display="flex"
                alignItems="center"
              >
                <Image
                  height="30px"
                  width="30px"
                  borderRadius="50%"
                  src={community.image_url}
                  alt={community.name}
                  mr="0.25rem"
                />
                <Text fontSize="0.85rem" color="text.primary">
                  {community.name}
                </Text>
              </Box>
            );
          })}
          {hasNext && (
            <Text
              color="text.primary"
              my="0.5rem"
              textAlign="center"
              fontSize="0.85rem"
              role="button"
              onClick={() => seeMore(searchInput)}
            >
              See more
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Searchbar;
