import AppView from '@components/AppView';
import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import PlaylistModal from '@components/PlaylistModal';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedAudios from '@components/RecommendedAudios';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import { useQueryClient } from '@tanstack/react-query';
import colors from '@utils/colors';
import React = require('react');
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {AudioData, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchPlaylist} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {updateNotification} from 'src/store/notification';
import {
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';

interface Props {}

const Home: React.FC<Props> = () => {
  const [showOptions, setShowOptions] = React.useState(false);
  const [selectedAudio, setSelectedAudio] = React.useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = React.useState(false);
  const dispatch = useDispatch();
  const {onAudioPress} = useAudioController();
  const queryClient = useQueryClient()

  const {data} = useFetchPlaylist();

  const handleOnFavPress = async () => {
    if (!selectedAudio) {
      return;
    }
    try {
      const client = await getClient();
      await client.post(`/favorite?audioId=${selectedAudio.id}`);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setSelectedAudio(undefined);
    setShowOptions(false);
  };
  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };
  const handleAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };
  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) {
      return;
    }

    try {
      const client = await getClient();
      await client.post('/playlist/create', {
        audioId: selectedAudio?.id,
        title: value.title,
        visibility: value.private ? 'private' : 'public',
      });
      dispatch(
        updateNotification({message: 'New playlist added !', type: 'success'}),
      );
      queryClient.invalidateQueries({queryKey: ['playlist']});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };
  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      await client.patch('/playlist', {
        playlistId: item.id,
        audioId: selectedAudio?.id,
        title: item.title,
        visibility: item.visibility,
      });
      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        updateNotification({message: 'New audio added !', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };
  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <RecentlyPlayed />
        <View style={styles.space} />
        <LatestUploads
          onAudioPress={onAudioPress}
          onAudioLongPress={handleOnLongPress}
        />
        <View style={styles.space} />
        <RecommendedAudios
          onAudioPress={onAudioPress}
          onAudioLongPress={handleOnLongPress}
        />
        <View style={styles.space} />
        <RecommendedPlaylist onListPress={handleOnListPress} />
        <OptionsModal
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          options={[
            {
              title: 'Add to playlist',
              icon: 'playlist-music',
              onPress: handleAddToPlaylist,
            },
            {
              title: 'Add to favorite',
              icon: 'cards-heart',
              onPress: handleOnFavPress,
            },
          ]}
          renderItem={item => {
            return (
              <Pressable onPress={item.onPress} style={styles.optionsContainer}>
                <MaterialComIcon
                  size={24}
                  name={item.icon}
                  color={colors.PRIMARY}
                />
                <Text style={styles.optionsLabel}>{item.title}</Text>
              </Pressable>
            );
          }}
        />
        <PlaylistModal
          list={data || []}
          visible={showPlaylistModal}
          onRequestClose={() => {
            setShowPlaylistModal(false);
          }}
          onCreateNewPress={() => {
            setShowPlaylistModal(false);
            setShowPlaylistForm(true);
          }}
          onPlaylistPress={updatePlaylist}
        />
        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => {
            setShowPlaylistForm(false);
          }}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionsLabel: {fontSize: 16, color: colors.PRIMARY, marginLeft: 5},
  space: {
    marginBottom: 15,
  },
});

export default Home;
