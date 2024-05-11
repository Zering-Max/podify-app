import colors from '@utils/colors';
import React = require('react');
import {Image, StyleSheet, Text, View} from 'react-native';
import CircleUI from '@ui/CircleUI';

interface Props {
  heading?: string;
  subHeading?: string;
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<Props> = props => {
  return (
    <View style={styles.container}>
      <CircleUI size={200} position="top-left" />
      <CircleUI size={100} position="top-right" />
      <CircleUI size={100} position="bottom-left" />
      <CircleUI size={200} position="bottom-right" />
      <View style={styles.headerContainer}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require('../assets/podcast.png')}
          />
          <Text style={styles.title}>PodMax</Text>
        </View>
        <Text style={styles.heading}>{props.heading}</Text>
        <Text style={styles.subHeading}>{props.subHeading}</Text>
      </View>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: {color: colors.CONTRAST, fontSize: 16},
  headerContainer: {width: '100%', marginBottom: 20},
  title: {
    fontSize: 28,
    color: colors.SECONDARY,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: colors.SECONDARY,
  },
  image: {height: 75, width: 75, borderRadius: 37},
  row: {flexDirection: 'row', alignItems: 'center'},
});

export default AuthFormContainer;
