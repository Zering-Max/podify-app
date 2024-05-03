import AudioListModal from '@ui/AudioListModal';
import React = require('react');
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: React.FC<Props> = ({visible, onRequestClose}) => {
  const {onGoingList} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  return (
    <AudioListModal
      visible={visible}
      onRequestClose={onRequestClose}
      header="Audios on the way"
      data={onGoingList}
      onItemPress={onAudioPress}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CurrentAudioList;
