import {useMutation, useQueryClient} from '@tanstack/react-query';
import AppModal from '@ui/AppModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData, CompletePlaylist} from 'src/@types/audio';
import {getClient} from 'src/api/client';
import {useFetchPlaylistAudios} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

interface Props {}

const removeAudioFromPlaylist = async (id: string, playlistId: string) => {
  const client = await getClient();
  client.delete(`playlist?playlistId=${playlistId}&audioId=${id}`);
};

const PlaylistAudioModal: React.FC<Props> = () => {
  const {visible, selectedListId, isPrivate, allowPlaylistAudioRemove} =
    useSelector(getPlaylistModalState);
  const [removing, setRemoving] = React.useState(false);
  const dispatch = useDispatch();
  const {data, isLoading} = useFetchPlaylistAudios(
    selectedListId || '',
    isPrivate || false,
  );
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async ({id, playlistId}) =>
      removeAudioFromPlaylist(id, playlistId),
    onMutate: (variable: {id: string; playlistId: string}) => {
      queryClient.setQueryData<CompletePlaylist>(
        ['playlist-audios', selectedListId],
        oldData => {
          let finalData: CompletePlaylist = {title: '', id: '', audios: []};
          if (!oldData) {
            return finalData;
          }
          const audios = oldData?.audios.filter(
            item => item.id !== variable.id,
          );

          return {...oldData, audios};
        },
      );
    },
  });

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.swipeableContainer}>
        <Animated.View style={{transform: [{scale}]}}>
          <Text style={{color: colors.CONTRAST}}>
            {removing ? 'Removing...' : 'Remove'}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderItem: ListRenderItem<AudioData> = ({item}) => {
    if (allowPlaylistAudioRemove) {
      return (
        <Swipeable
          onSwipeableOpen={() => {
            deleteMutation.mutate({
              id: item.id,
              playlistId: selectedListId || '',
            });
            setRemoving(false);
          }}
          onSwipeableWillOpen={() => setRemoving(true)}
          renderRightActions={renderRightActions}>
          {/* pour permettre que le onPress ne se délcenche pas lorsqu'on swipe */}
          <RectButton onPress={() => onAudioPress(item, data?.audios || [])}>
            <AudioListItem
              isPlaying={onGoingAudio?.id === item.id}
              audio={item}
            />
          </RectButton>
        </Swipeable>
      );
    } else {
      return (
        <AudioListItem
          isPlaying={onGoingAudio?.id === item.id}
          audio={item}
          onPress={() => onAudioPress(item, data?.audios || [])}
        />
      );
    }
  };

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <View style={styles.container}>
        {isLoading ? (
          <AudioListLoadingUI />
        ) : (
          <>
            <Text style={styles.title}>{data?.title}</Text>
            <FlatList
              contentContainerStyle={styles.flatList}
              data={data?.audios}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<EmptyRecords title="No audios to render." />}
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
  flatList: {
    paddingBottom: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
  },
  swipeableContainer: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default PlaylistAudioModal;
