import { createContext, useState } from 'react';
import { ICommunityContext, ICommunity } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const CommunityContext = createContext<ICommunityContext | null>(null);

const CommunityContextProvider = ({ children }: IChildren) => {
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [menuHasNextPage, setMenuHasNextPage] = useState(false);
  const [menuCurrentPage, setMenuCurrentPage] = useState(1);

  const handleSetCommunities = (communities: ICommunity[]) => {
    setCommunities((prevState) => [...prevState, ...communities]);
  };

  const resetCommunities = () => {
    setCommunities([]);
    setMenuCurrentPage(1);
    setMenuHasNextPage(false);
  };

  const value = {
    communities,
    menuHasNextPage,
    menuCurrentPage,
    setMenuCurrentPage,
    setMenuHasNextPage,
    setCommunities,
    handleSetCommunities,
    resetCommunities,
  };
  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export default CommunityContextProvider;
