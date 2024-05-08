import deepEqual from 'deep-equal';
import React from 'react';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from 'src/store/player';

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const list: Track[] = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      artwork: item.poster || require('../assets/music.png'),
      url: item.file,
      artist: item.owner.name,
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...list]);
};

const useAudioController = () => {
  const {state: playbackState} = usePlaybackState() as {state?: State};
  const {onGoingAudio, onGoingList} = useSelector(getPlayerState);
  const dispatch = useDispatch();
  const isPlayerReady = playbackState !== State.None;
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Loading;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      // joue audio pour la première fois
      await updateQueue(data);
      dispatch(updateOnGoingAudio(item));
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      return dispatch(updateOnGoingList(data));
    }

    if (isPlaying && onGoingAudio?.id === item.id) {
      return await TrackPlayer.pause();
    }

    if (isPaused && onGoingAudio?.id === item.id) {
      return await TrackPlayer.play();
    }

    if (onGoingAudio?.id !== item.id) {
      const fromSameList = deepEqual(onGoingList, data);

      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);

      if (!fromSameList) {
        // lecture audio d'une playlist différente
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
        return;
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
  };
  const togglePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    }
    if (isPaused) {
      await TrackPlayer.play();
    }
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getProgress().then(
      progress => progress.position,
    );
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const onNextPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex === undefined) {
      return;
    }
    const nextIndex = currentIndex + 1;
    const nextAudio = currentList[nextIndex];

    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };

  const onPreviousPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex === undefined) {
      return;
    }
    const preIndex = currentIndex - 1;
    const nextAudio = currentList[preIndex];

    if (nextAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateOnGoingAudio(onGoingList[preIndex]));
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  React.useEffect(() => {
    // focntions possibles en backgroudn mode
    const setupPlayer = async () => {
      if (isReady) {
        return;
      }
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };
    setupPlayer();
    isReady = true;
  });

  return {
    onAudioPress,
    isPlayerReady,
    isPlaying,
    togglePlayPause,
    isBusy,
    seekTo,
    skipTo,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  };
};

export default useAudioController;
