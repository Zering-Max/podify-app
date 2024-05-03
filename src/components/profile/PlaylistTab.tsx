import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PlaylistItem from '@ui/PlaylistItem';
import React = require('react');
import {ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {useFetchPlaylist} from 'src/hooks/query';
import {
  updateIsPlaylistPrivate,
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';

interface Props {}

const PlaylistTab: React.FC<Props> = () => {
  const {data, isLoading} = useFetchPlaylist();
  const dispatch = useDispatch();

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateIsPlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  if (isLoading) {
    return <AudioListLoadingUI />;
  }
  // if (!data) {
  //   return <EmptyRecords title="There is no audio." />;
  // }
  return (
    <ScrollView style={styles.container}>
      {!data?.length ? <EmptyRecords title="There is no playlist." /> : null}
      {data?.map(playlist => {
        return (
          <PlaylistItem
            onPress={() => handleOnListPress(playlist)}
            key={playlist.id}
            playlist={playlist}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlaylistTab;
