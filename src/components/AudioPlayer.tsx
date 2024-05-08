import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import React = require('react');
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getPlayerState, updatePlaybackRate} from 'src/store/player';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';
import useAudioController from 'src/hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import PlayerControler from '@ui/PlayerControler';
import Loader from '@ui/Loader';
import PlaybackRateSelector from '@ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  animation?: boolean;
  onListOptionPress(): void;
  onProfileLinkPress(): void;
}

const formatedDuration = (duration = 0) => {
  return formatDuration(duration, {leading: true});
};

const AudioPlayer: React.FC<Props> = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}) => {
  const [showAudioInfo, setShowAudioInfo] = React.useState(false);
  const {onGoingAudio, playbackRate} = useSelector(getPlayerState);
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');
  const {
    seekTo,
    skipTo,
    togglePlayPause,
    isPlaying,
    isBusy,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  } = useAudioController();
  const {duration, position} = useProgress();
  const dispatch = useDispatch();

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    if (skipType === 'forward') {
      await skipTo(10);
    }
    if (skipType === 'reverse') {
      await skipTo(-10);
    }
  };

  const onPlaybackRatePress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };
  console.log('rendrered audioplayer');
  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoBtn}>
          <AntDesign name="infocirlceo" color={colors.CONTRAST} size={24} />
        </Pressable>
        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink
            onPress={onProfileLinkPress}
            title={onGoingAudio?.owner.name || ''}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formatedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formatedDuration(duration * 1000)}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            onSlidingComplete={updateSeek}
          />
          <View style={styles.controls}>
            <PlayerControler onPress={handleOnPreviousPress} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerControler>
            <PlayerControler
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer>
              <FontAwesomeIcon
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerControler>
            <PlayerControler>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  playing={isPlaying}
                  onPress={togglePlayPause}
                  color={colors.PRIMARY}
                />
              )}
            </PlayerControler>
            <PlayerControler
              ignoreContainer
              onPress={() => handleSkipTo('forward')}>
              <FontAwesomeIcon
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerControler>
            <PlayerControler onPress={handleOnNextPress} ignoreContainer>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerControler>
          </View>
          <PlaybackRateSelector
            activeRate={playbackRate.toString()}
            onPress={onPlaybackRatePress}
            containerStyle={{marginTop: 20}}
          />
          <View style={styles.listOptionBtnContainer}>
            <PlayerControler onPress={onListOptionPress} ignoreContainer>
              <MaterialComIcon
                name="playlist-music"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerControler>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  skipText: {
    color: colors.CONTRAST,
    fontSize: 12,
    marginTop: 2,
  },
  infoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});

export default AudioPlayer;
