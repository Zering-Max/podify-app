import React = require('react');
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNotification from './AppNotification';

interface Props {
  children: React.ReactNode;
}

const AppContainer: React.FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNotification />
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
