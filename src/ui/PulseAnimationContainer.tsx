import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
}

const PulseAnimationContainer: React.FC<Props> = ({children}) => {
  const opacitySharedValue = useSharedValue(1);
  const opacity = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });
  React.useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, {
        duration: 1000,
      }),
      -1,
      true,
    );
  }, [opacitySharedValue]);
  return <Animated.View style={opacity}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.SECONDARY,
  },
});

export default PulseAnimationContainer;
