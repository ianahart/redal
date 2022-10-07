import { retreiveTokens } from './utils';

export const createAccountState = {
  first_name: { name: 'first_name', value: '', error: '', type: 'text' },
  last_name: { name: 'last_name', value: '', error: '', type: 'text' },
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
  confirm_password: { name: 'confirm_password', value: '', error: '', type: 'password' },
};

export const memberState = {
  id: 0,
  community_id: 0,
  user_id: 0,
};

export const loginState = {
  email: { name: 'email', value: '', error: '', type: 'email' },
  password: { name: 'password', value: '', error: '', type: 'password' },
};

export const communityState = {
  author_id: 0,
  id: 0,
  image_url: '',
  name: '',
  slug: '',
  type: '',
  user_id: 0,
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

export const createCommunityFormState = {
  name: { name: 'name', value: '', error: '' },
  type: { name: 'type', value: '', error: '' },
};

export const profileFormState = {
  display_name: { name: 'display_name', value: '', error: '' },
  about: { name: 'about', value: '', error: '' },
};

export const postState = {
  avatar_url: '',
  comment_count: 0,
  display_date: '',
  id: 0,
  initials: '',
  name: '',
  post: '',
  title: '',
  upvote_count: 0,
  user_upvoted: null,
  bookmark_posts: [],
  user_bookmarked: false,
  user_id: 0,
  community_name: '',
  image_url: '',
};
