import colors from '@utils/colors';
import React = require('react');
import {FlatList, StyleSheet, Text, View} from 'react-native';
import AppModal from './AppModal';
import {AudioData} from 'src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  data: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose(): void;
  loading?: boolean;
  onItemPress(item: AudioData, data: AudioData[]): void;
}

const AudioListModal: React.FC<Props> = ({
  header,
  visible,
  onRequestClose,
  data,
  loading,
  onItemPress,
}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        {loading ? (
          <AudioListLoadingUI />
        ) : (
          <>
            <Text style={styles.header}>{header}</Text>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <AudioListItem
                    onPress={() => onItemPress(item, data)}
                    audio={item}
                    isPlaying={onGoingAudio?.id === item.id}
                  />
                );
              }}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
  flatList: {
    paddingBottom: 50,
  },
});

export default AudioListModal;
