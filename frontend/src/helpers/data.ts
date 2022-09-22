import { retreiveTokens } from './utils';

export const createAccountState = {
  first_name: { name: 'first_name', value: '', error: '', type: 'text' },
  last_name: { name: 'last_name', value: '', error: '', type: 'text' },
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
  confirm_password: { name: 'confirm_password', value: '', error: '', type: 'password' },
};

export const loginState = {
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
};

export const userState = {
  about: '',
  display_name: '',
  avatar_url: null,
  email: '',
  id: 0,
  initials: '',
  last_name: '',
  first_name: '',
  logged_in: false,
  color: '',
};

const tokens = retreiveTokens();
export const tokenState = {
  access_token: tokens?.access_token ? tokens.access_token : '',
  refresh_token: tokens?.refresh_token ? tokens.refresh_token : '',
};

export const profileFormState = {
  display_name: { name: 'display_name', value: '', error: '' },
  about: { name: 'about', value: '', error: '' },
};
