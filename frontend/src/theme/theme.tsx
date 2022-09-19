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
    purple: {
      primary: '#9b5de5',
    },
    pink: {
      primary: '#f15bb5',
    },

    blue: {
      primary: '#3182ce',
    },

    cover: {
      primary: 'rgba(54, 54, 54, 0.8)',
    },
  },
});
export default theme;
