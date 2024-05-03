import colors from '@utils/colors';
import React = require('react');
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
}

const EmptyRecords: React.FC<Props> = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.INACTIVE_CONTRAST,
  },
});

export default EmptyRecords;
