import colors from '@utils/colors';
import React = require('react');
import {Dimensions, Modal, Pressable, StyleSheet} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onRequestClose(): void;
  animation?: boolean;
}

const {height} = Dimensions.get('window');

const modalHeight = height - 75;

const AppModal: React.FC<Props> = ({
  children,
  visible,
  onRequestClose,
  animation,
}) => {
  const translateY = useSharedValue(modalHeight);
  const translateStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));
  const handleClose = () => {
    translateY.value = modalHeight;
    onRequestClose();
  };
  const gesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY <= 0) {
        return;
      }

      translateY.value = e.translationY;
    })
    .onFinalize(e => {
      if (e.translationY <= modalHeight / 2) {
        translateY.value = 0;
      } else {
        translateY.value = modalHeight;
        runOnJS(handleClose)();
      }
    });

  React.useEffect(() => {
    if (visible) {
      // translateY.value = withTiming(0, {duration: animation ? 200 : 0});
      translateY.value = withTiming(0);
    }
  }, [translateY, visible, animation]);
  return (
    <Modal onRequestClose={handleClose} visible={visible} transparent>
      <GestureHandlerRootView style={{flex: 1}}>
        <Pressable onResponderEnd={handleClose} style={styles.backdrop} />
        {/* pour résoudre le conflit entre FlatList (playlistAudioModal et AudioListModal) et l'animation gesture */}
        <Animated.View style={[styles.modal, translateStyle]}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={styles.handle} />
          </GestureDetector>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: modalHeight,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
  },
  handle: {
    width: '100%',
    height: 45,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});

export default AppModal;
