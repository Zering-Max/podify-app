import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PlaylistItem from '@ui/PlaylistItem';
import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {PublicProfileTabParamList} from 'src/@types/navigation';
import {useFetchPublicPlaylist} from 'src/hooks/query';
import {
  updateAllowPlaylistAudioRemove,
  updateIsPlaylistPrivate,
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';

type Props = NativeStackScreenProps<
  PublicProfileTabParamList,
  'PublicPlaylist'
>;

const PublicPlaylistTab: React.FC<Props> = props => {
  const {data} = useFetchPublicPlaylist(props.route.params.profileId);
  const dispatch = useDispatch();

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateAllowPlaylistAudioRemove(false));
    dispatch(updateIsPlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <ScrollView style={styles.container}>
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

export default PublicPlaylistTab;
