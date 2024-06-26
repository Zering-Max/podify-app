import React = require('react');
import {StyleSheet, Text, View} from 'react-native';
import {useFetchRecommendedAudios} from 'src/hooks/query';
import colors from '@utils/colors';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import {AudioData} from 'src/@types/audio';
import AudioCard from '@ui/AudioCard';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}

const dummyData = new Array(6).fill('');

const RecommendedAudios: React.FC<Props> = ({
  onAudioPress,
  onAudioLongPress,
}) => {
  const {data = [], isLoading} = useFetchRecommendedAudios();
  const {onGoingAudio} = useSelector(getPlayerState);

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View>
          <View style={styles.dummyTitleView} />
          <GridView
            col={3}
            data={dummyData}
            renderItem={() => {
              return <View style={styles.dummyAudioView} />;
            }}
          />
        </View>
      </PulseAnimationContainer>
    );
  }
  // if (!data.length) {
  //   return null;
  // }
  return (
    <View>
      <Text style={styles.title}>You may like this</Text>
      {!data?.length ? (
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.INACTIVE_CONTRAST,
          }}>
          There is no recommandations for you.
        </Text>
      ) : (
        <GridView
          col={3}
          data={data || []}
          renderItem={item => {
            return (
              <AudioCard
                title={item.title}
                poster={item.poster}
                onPress={() => onAudioPress(item, data)}
                onLongPress={() => onAudioLongPress(item, data)}
                containerStyle={{width: '100%'}}
                playing={onGoingAudio?.id === item.id}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
  },
  audioTitle: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  poster: {width: '100%', aspectRatio: 1, borderRadius: 7},
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
  dummyAudioView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
  },
  dummyAudioContainer: {
    flexDirection: 'row',
  },
});

export default RecommendedAudios;
