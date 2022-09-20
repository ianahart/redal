import { createContext, useState } from 'react';
import { IUserContext, IUser, ITokens } from '../interfaces';
import { userState, tokenState } from '../helpers/data';
interface IChildren {
  children: React.ReactNode;
}

export const UserContext = createContext<IUserContext | null>(null);

const UserContextProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState<IUser>(userState);
  const [tokens, setTokens] = useState<ITokens>(tokenState);

  const logout = () => {
    localStorage.clear();
    setTokens({ refresh_token: '', access_token: '' });
    setUser(userState);
  };

  const stowTokens = (tokens: ITokens) => {
    setTokens(tokens);
    localStorage.setItem('tokens', JSON.stringify(tokens));
  };

  return (
    <UserContext.Provider
      value={{ logout, setUser, setTokens, tokens, user, stowTokens }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
