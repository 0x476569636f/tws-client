import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

type loadingProps = {
  size?: number | 'small' | 'large';
  color?: string;
};

const Loading: React.FC<loadingProps> = ({ size = 'large' }) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <View>
      <ActivityIndicator size={size} color={isDarkColorScheme ? 'white' : 'black'} />
    </View>
  );
};

export default Loading;
