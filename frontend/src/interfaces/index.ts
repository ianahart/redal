export interface ICreateAccountForm {
  first_name: { name: string; value: string; error: string; type: string };
  last_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
  confirm_password: { name: string; value: string; error: string; type: string };
}

export interface ILoginForm {
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
}

export interface IProfileForm {
  display_name: { name: string; value: string; error: string };
  about: { name: string; value: string; error: string };
}

export interface ICreateCommunityForm {
  name: { name: string; value: string; error: string };
  type: { name: string; value: string; error: string };
}

export interface IUser {
  avatar_url: string | null;
  email: string;
  id: number;
  initials: string;
  last_name: string;
  first_name: string;
  logged_in: boolean;
  color: string;
  about: string | null;
  display_name: string | null;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IUserContext {
  user: IUser;
  tokens: ITokens;
  logout: () => void;
  setUser: (user: IUser) => void;
  updateUser: (user: IUser) => void;
  setTokens: (tokens: ITokens) => void;
  stowTokens: (tokens: ITokens) => void;
}

export interface ILoginResponse {
  message?: string;
  tokens: ITokens;
  user: IUser;
}

export interface IProfileFormResponse {
  message?: string;
  user: IUser;
}
