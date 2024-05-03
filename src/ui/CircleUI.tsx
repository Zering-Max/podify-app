import colors from '@utils/colors';
import React = require('react');
import {FlexStyle, View} from 'react-native';

interface Props {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const AppLink: React.FC<Props> = props => {
  let viewPosition: FlexStyle = {};

  switch (props.position) {
    case 'top-left':
      viewPosition = {
        top: -props.size / 2,
        left: -props.size / 2,
      };
      break;
    case 'top-right':
      viewPosition = {
        top: -props.size / 2,
        right: -props.size / 2,
      };
      break;
    case 'bottom-left':
      viewPosition = {
        bottom: -props.size / 2,
        left: -props.size / 2,
      };
      break;
    case 'bottom-right':
      viewPosition = {
        bottom: -props.size / 2,
        right: -props.size / 2,
      };
      break;
  }
  return (
    <View
      style={{
        width: props.size,
        height: props.size,
        position: 'absolute',
        ...viewPosition,
      }}>
      <View
        style={{
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
          backgroundColor: colors.SECONDARY,
          opacity: 0.3,
        }}
      />
      <View
        style={{
          width: props.size / 1.5,
          height: props.size / 1.5,
          borderRadius: props.size / 2,
          backgroundColor: colors.SECONDARY,
          opacity: 0.3,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: [
            {translateX: -props.size / 3},
            {translateY: -props.size / 3},
          ],
        }}
      />
    </View>
  );
};

export default AppLink;
