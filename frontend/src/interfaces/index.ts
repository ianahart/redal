import { Value } from 'react-quill';

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

export interface IBookmark {
  id: number;
}

export interface IFullBookmark extends IBookmark {
  post: { id: number; title: string };
}

export interface IRetrieveBookmarkResponse {
  has_next: true;
  message: string;
  page: number;
  bookmarks: IFullBookmark[];
}

export interface IPost {
  id: number;
  avatar_url: string | null;
  initials: string;
  title: string;
  comment_count: number;
  display_date: string;
  name: string;
  upvote_count: number;
  user_upvoted: string | null;
  user_bookmarked: boolean;
  bookmark_posts: IBookmark[];
  image_url: string;
  community_name: string;
  user_id: number;
  community_slug: string;
  community_id: number;
}

export interface IFullPost extends IPost {
  post: Value;
  user_id: number;
}

export interface IPostsResponse {
  message?: string;
  has_next: boolean;
  page: number;
  posts: IPost[];
}

export interface IMember {
  id: number;
  community_id: number;
  user_id: number;
}

export interface IRtrieveMemberResponse {
  message?: string;
  member: IMember;
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
  setting_user: ISetting;
}

export interface ISetting {
  id: number;
  user_id: number;
  notifications_on: boolean;
  messages_on: boolean;
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

export interface ICommunity {
  id: number;
  name: string;
  type: string;
  image_url: string;
  slug: string;
}

export interface ICommunityName {
  id: number;
  name: string;
}

export interface ICreateCommunityPostResponse {
  message?: string;
  communities: ICommunityName[];
  has_next: boolean;
  page: number;
}

export interface IAuthorCommunityResponse {
  message?: string;
  communities: ICommunity[];
  has_next: boolean;
  page: number;
}

export interface ICreateCommunityResponse {
  message?: string;
  communities: ICommunity[];
  has_next: boolean;
  page: number;
}

export interface ISearchCommunityResponse {
  message?: string;
  communities: ICommunity[];
  has_next: boolean;
  page: number;
}

export interface IRetrieveCommunityResponse {
  community: ICommunity;
  is_member: boolean;
  message?: string;
}

export interface ICommunityContext {
  communities: ICommunity[];
  handleSetCommunities: (communities: ICommunity[]) => void;
  setCommunities: (communities: ICommunity[]) => void;
  resetCommunities: () => void;
  menuHasNextPage: boolean;
  menuCurrentPage: number;
  setMenuCurrentPage: (menuCurrentPage: number) => void;
  setMenuHasNextPage: (menuHasNextPage: boolean) => void;
}

export interface IComment {
  id: number;
  text: string;
  user: IUser;
  readable_date: string;
  like_id: number | null;
  like_count: number;
}

export interface INotification {
  id: number;
  text: string;
  avatar_url: string;
}

export interface ICommentsResponse {
  has_next: boolean;
  message?: string;
  page: number;
  comments: IComment[];
}
