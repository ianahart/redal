import { extendTheme } from '@chakra-ui/react';
//import { Input } from './components/Input';
// import { layerStyles } from './layerStyles';
export const theme = extendTheme({
  // layerStyles,
  components: {
    //  Input,
    //    Button,
  },
  colors: {
    border: {
      primary: '#e4e4e6',
    },
    black: {
      primary: '#181717',
      secondary: '#200F21',
    },
    text: {
      primary: '#8a8f9d',
      secondary: '#565757',
      tertiary: '#403d40',
    },
    light: {
      primary: '#e4e3e3',
    },
    blue: {
      primary: '#001f30',
      secondary: '#1e293b',
      tertiary: '#334e5c',
      quatenary: '#0080FF',
    },
    red: {
      primary: '#ff3333',
    },
    cover: {
      primary: 'rgba(54, 54, 54, 0.8)',
    },
  },
});
export default theme;
