import { useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import { retreiveTokens } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';
interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const { user } = useContext(UserContext) as IUserContext;

  if (retreiveTokens()?.access_token) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAuth;
