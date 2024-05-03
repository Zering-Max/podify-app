import React = require('react');
import {StyleSheet, View} from 'react-native';
import MiniAudioPlayer from './MiniAudioPlayer';
import useAudioController from 'src/hooks/useAudioController';
import PlaylistAudioModal from './PlaylistAudioModal';

interface Props {
  children: React.ReactNode;
}

const AppView: React.FC<Props> = props => {
  const {isPlayerReady} = useAudioController();
  return (
    <View style={styles.container}>
      <View style={styles.children}>{props.children}</View>
      {isPlayerReady ? <MiniAudioPlayer /> : null}
      <PlaylistAudioModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});

export default AppView;
