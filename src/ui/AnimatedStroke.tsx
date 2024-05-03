import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  delay: number;
  height: number;
}

const AnimatedStroke: React.FC<Props> = ({delay, height}) => {
  const sharedValue = useSharedValue(5);
  const heightStyle = useAnimatedStyle(() => ({height: sharedValue.value}));

  React.useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height), -1, true),
    );
  }, [sharedValue, height, delay]);
  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

const styles = StyleSheet.create({
  container: {},
  stroke: {
    width: 4,
    backgroundColor: colors.CONTRAST,
    marginRight: 5,
  },
});

export default AnimatedStroke;
