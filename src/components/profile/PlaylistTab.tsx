import OptionsModal from '@components/OptionsModal';
import {useQueryClient} from '@tanstack/react-query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PaginatedList from '@ui/PaginatedList';
import PlaylistItem from '@ui/PlaylistItem';
import React = require('react');
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {fetchPlaylist, useFetchPlaylist} from 'src/hooks/query';
import {updateNotification} from 'src/store/notification';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  updateAllowPlaylistAudioRemove,
  updateIsPlaylistPrivate,
  updatePlaylistVisibility,
  updateSelectedListId,
} from 'src/store/playlistModal';
import OptionSelector from '@ui/OptionSelector';
import colors from '@utils/colors';
import PlaylistForm from '@components/PlaylistForm';
import deepEqual = require('deep-equal');
import {getClient} from 'src/api/client';

interface Props {}

let pageNumber = 0;

const PlaylistTab: React.FC<Props> = () => {
  const {data, isLoading, isFetching} = useFetchPlaylist();
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = React.useState(true);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<Playlist>();

  const queryClient = useQueryClient();

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateIsPlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updateAllowPlaylistAudioRemove(true));
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  const handleOnEndReached = async () => {
    setIsFetchingMore(true);
    try {
      if (!data) {
        return;
      }
      pageNumber += 1;
      const playlist = await fetchPlaylist(pageNumber);

      if (!playlist || !playlist.length) {
        setHasMore(false);
      }
      const newList = [...data, playlist];
      queryClient.setQueryData(['playlist'], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setIsFetchingMore(false);
  };

  const updatePlaylist = async (item: Playlist) => {
    try {
      const client = await getClient();
      closeUpdateForm();
      await client.patch('/playlist', item);
      queryClient.invalidateQueries({queryKey: ['playlist']});

      dispatch(
        updateNotification({message: 'Playlist updated !', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnRefresh = () => {
    pageNumber = 0;
    setHasMore(true);
    queryClient.invalidateQueries({queryKey: ['playlist']});
  };

  const handleOnLongPress = (playlist: Playlist) => {
    setSelectedPlaylist({
      ...playlist,
    });
    setShowOptions(true);
  };

  const closeOptions = () => {
    setShowOptions(false);
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
  };

  const handleOnEditPress = () => {
    closeOptions();
    setShowUpdateForm(true);
  };

  const handleOnDeletePress = async () => {
    try {
      const client = await getClient();
      closeOptions();
      await client.delete(
        `/playlist?all=yes&playlistId=${selectedPlaylist?.id}`,
      );
      queryClient.invalidateQueries({queryKey: ['playlist']});

      dispatch(
        updateNotification({message: 'Playlist removed !', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  if (isLoading) {
    return <AudioListLoadingUI />;
  }

  console.log('DATA', data);

  return (
    <>
      <PaginatedList
        data={data}
        onEndReached={handleOnEndReached}
        hasMore={hasMore}
        isFetching={isFetchingMore}
        onRefresh={handleOnRefresh}
        refreshing={isFetching}
        ListEmptyComponent={<EmptyRecords title="There is no playlist." />}
        renderItem={({item}) => {
          return (
            <PlaylistItem
              onPress={() => handleOnListPress(item)}
              key={item.id}
              playlist={item}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        }}
      />
      <OptionsModal
        visible={showOptions}
        onRequestClose={closeOptions}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
          {
            title: 'Delete',
            icon: 'delete',
            onPress: handleOnDeletePress,
          },
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              label={item.title}
              onPress={item.onPress}
              icon={
                <AntDesign size={24} name={item.icon} color={colors.PRIMARY} />
              }
            />
          );
        }}
      />
      <PlaylistForm
        visible={showUpdateForm}
        onRequestClose={closeUpdateForm}
        onSubmit={value => {
          const isSame = deepEqual(value, {
            title: selectedPlaylist?.title,
            private: selectedPlaylist?.visibility === 'private',
          });
          if (isSame || !selectedPlaylist) {
            return;
          }
          updatePlaylist({
            ...selectedPlaylist,
            title: value.title,
            visibility: value.private ? 'private' : 'public',
          });
        }}
        initialValue={{
          title: selectedPlaylist?.title || '',
          private: selectedPlaylist?.visibility === 'private',
        }}
      />
    </>
  );
};

export default PlaylistTab;
