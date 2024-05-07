import {useQueryClient} from '@tanstack/react-query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React = require('react');
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useFetchFavorites} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const FavoriteTab: React.FC<Props> = () => {
  const {data, isLoading, isFetching} = useFetchFavorites();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  if (isLoading) {
    return <AudioListLoadingUI />;
  }
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={handleOnRefresh}
          tintColor={colors.CONTRAST}
        />
      }>
      {!data?.length ? <EmptyRecords title="There is no favorite." /> : null}
      {data?.map(item => {
        return (
          <AudioListItem
            isPlaying={onGoingAudio?.id === item.id}
            onPress={() => onAudioPress(item, data)}
            key={item.id}
            audio={item}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default FavoriteTab;
