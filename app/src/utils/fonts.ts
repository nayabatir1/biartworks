import type { TextStyle } from 'react-native';

export interface FontStyles {
  regular: TextStyle;
  light: TextStyle;
  black: TextStyle;
  bold: TextStyle;
  thin: TextStyle;
}

const fonts: FontStyles = {
  regular: {
    fontFamily: 'Lato-Regular',
  },
  light: {
    fontFamily: 'Lato-Light',
  },
  black: {
    fontFamily: 'Lato-Black',
  },
  bold: {
    fontFamily: 'Lato-Bold',
  },
  thin: {
    fontFamily: 'Lato-Thin',
  },
};

export default fonts;
