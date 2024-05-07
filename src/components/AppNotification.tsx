import colors from '@utils/colors';
import React = require('react');
import {StyleSheet, Text} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {getNotificationState, updateNotification} from 'src/store/notification';

interface Props {}

const AppNotification: React.FC<Props> = () => {
  const {message, type} = useSelector(getNotificationState);
  const height = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const dispatch = useDispatch();

  let backgroundColor = colors.ERROR;
  let textColor = colors.CONTRAST;

  switch (type) {
    case 'success':
      backgroundColor = colors.SUCCESS;
      break;
  }
  React.useEffect(() => {
    let timeoutId: any;
    const performAnimation = () => {
      height.value = withTiming(45, {
        duration: 150,
      });
      timeoutId = setTimeout(() => {
        height.value = withTiming(0, {
          duration: 150,
        });
        dispatch(updateNotification({message: '', type}));
      }, 3000);
    };
    if (message) {
      performAnimation();
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, height, dispatch, type]);
  return (
    <Animated.View style={[styles.container, {backgroundColor}, heightStyle]}>
      <Text style={[styles.message, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});

export default AppNotification;
