import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';

const FullPost = () => {
  const params = useParams();

  const fetchPost = async (postId: string) => {
    try {
      if (!postId) return;
      const response = await http.get(`/posts/${postId}`);
      console.log(response);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    if (params.postId) {
      fetchPost(params.postId);
    }
  });
  return <Box minH="100vh">Full Post</Box>;
};

export default FullPost;
