import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet} from 'react-native';

interface Props {
  size?: number;
  children: React.ReactNode;
  ignoreContainer?: boolean;
  onPress?(): void;
}

const PlayerControler: React.FC<Props> = ({
  size = 45,
  children,
  ignoreContainer,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
      }}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlayerControler;
