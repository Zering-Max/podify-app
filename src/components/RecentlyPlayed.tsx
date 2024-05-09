import {useQueryClient} from '@tanstack/react-query';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import colors from '@utils/colors';
import React = require('react');
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {useFetchRecentlyPlayed} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const dummyData = new Array(4).fill('');

const RecentlyPlayed: React.FC<Props> = () => {
  const queryClient = useQueryClient();
  const {data, isLoading} = useFetchRecentlyPlayed();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);
  React.useEffect(() => {
    queryClient.invalidateQueries({queryKey: ['recently-played']});
  }, [data, queryClient]);

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View style={styles.dummyTitleView} />
        <GridView
          data={dummyData}
          renderItem={() => {
            return (
              <View
                style={{
                  height: 50,
                  backgroundColor: colors.INACTIVE_CONTRAST,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              />
            );
          }}
        />
      </PulseAnimationContainer>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      {!data?.length ? (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.INACTIVE_CONTRAST,
            }}>
            There is no audio recently played.
          </Text>
        </View>
      ) : (
        <GridView
          data={data || []}
          renderItem={item => {
            return (
              <View key={item.id} style={styles.listStyle}>
                <RecentlyPlayedCard
                  title={item.title}
                  poster={item.poster}
                  onPress={() => onAudioPress(item, data)}
                  isPlaying={onGoingAudio?.id === item.id}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listStyle: {
    marginBottom: 10,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default RecentlyPlayed;
