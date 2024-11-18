import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100;
};

const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100;
};

export { hp, wp };
