import colors from '@utils/colors';
import React = require('react');
import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import useAudioController from 'src/hooks/useAudioController';
import Loader from '@ui/Loader';
import {calculateUploadProgress} from '@utils/math';
import {useProgress} from 'react-native-track-player';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';
import {useFetchIsFavorite} from 'src/hooks/query';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {getClient} from 'src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeNavigatorStackParamList} from 'src/@types/navigation';
import {getAuthState} from 'src/store/auth';

interface Props {}

export const miniPlayerHeight = 60;

const MiniAudioPlayer: React.FC<Props> = () => {
  const [playerVisibility, setPlayerVisibility] = React.useState(false);
  const [showCurrentList, setShowCurrentList] = React.useState(false);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {profile} = useSelector(getAuthState);
  const {isPlaying, togglePlayPause, isBusy} = useAudioController();
  const progress = useProgress();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');
  const {data: isFav} = useFetchIsFavorite(onGoingAudio?.id || '');
  const queryClient = useQueryClient();
  const {navigate} =
    useNavigation<NavigationProp<HomeNavigatorStackParamList>>();

  const toggleIsFav = async (id: string) => {
    if (!id) {
      return;
    }
    const client = await getClient();
    client.post(`favorite?audioId=${id}`);
  };

  const favoriteMutation = useMutation({
    mutationFn: async id => toggleIsFav(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(['favorite', id], oldData => !oldData);
    },
  });

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };
  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };
  const handleCurrentListClose = () => {
    setShowCurrentList(false);
  };
  const handleOnListOptionPress = () => {
    closePlayerModal();
    setShowCurrentList(true);
  };
  const handleOnProfileLinkPress = () => {
    closePlayerModal();
    if (profile?.id === onGoingAudio?.owner.id) {
      navigate('Profile');
    } else {
      navigate('PublicProfile', {
        profileId: onGoingAudio?.owner.id || '',
      });
    }
  };
  console.log('rendred mini audioplayer');
  console.log(onGoingAudio);
  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${calculateUploadProgress({
            outputMin: 0,
            outputMax: 100,
            inputMin: 0,
            inputMax: progress.duration,
            inputValue: progress.position,
          })}%`,
        }}
      />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <Text style={styles.name}>{onGoingAudio?.owner.name}</Text>
        </Pressable>
        <Pressable
          onPress={() => favoriteMutation.mutate(onGoingAudio?.id || '')}
          style={{paddingHorizontal: 10}}>
          <AntDesign
            name={isFav ? 'heart' : 'hearto'}
            size={24}
            color={colors.CONTRAST}
          />
        </Pressable>
        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} />
        )}
      </View>
      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
        onListOptionPress={handleOnListOptionPress}
        onProfileLinkPress={handleOnProfileLinkPress}
      />
      <CurrentAudioList
        visible={showCurrentList}
        onRequestClose={handleCurrentListClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: miniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  poster: {
    height: miniPlayerHeight - 10,
    width: miniPlayerHeight - 10,
    borderRadius: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});

export default MiniAudioPlayer;
