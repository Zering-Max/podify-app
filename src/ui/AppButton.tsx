import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
  borderRadius?: number;
}

const AppButton: React.FC<Props> = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.container, {borderRadius: props.borderRadius || 25}]}>
      {props.busy ? (
        <Loader />
      ) : (
        <Text style={styles.title}>{props.title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppButton;
