import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  icon?: React.ReactNode;
  label: string;
  onPress?(): void;
}

const OptionSelector: React.FC<Props> = ({icon, label, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.optionsContainer}>
      {icon}
      <Text style={styles.optionsLabel}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionsLabel: {fontSize: 16, color: colors.PRIMARY, marginLeft: 5},
});

export default OptionSelector;
