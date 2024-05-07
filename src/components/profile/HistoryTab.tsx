import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {fetchHistories, useFetchHistories} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {History, historyAudio} from 'src/@types/audio';
import {useNavigation} from '@react-navigation/native';
import PaginatedList from '@ui/PaginatedList';

interface Props {}

let pageNumber = 0;

const HistoryTab: React.FC<Props> = () => {
  const {data, isLoading, isFetching} = useFetchHistories();
  const queryClient = useQueryClient();
  const [selectedHistories, setSelectedHistories] = React.useState<string[]>(
    [],
  );
  const [hasMore, setHasMore] = React.useState(true);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const navigation = useNavigation();

  const removeMutate = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) {
          return newData;
        }

        for (let dataObj of oldData) {
          const filterData = dataObj.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filterData.length > 0) {
            newData.push({date: dataObj.date, audios: filterData});
          }
        }
        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();
    await client.delete(`/history?histories=${JSON.stringify(histories)}`);
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleOnRefresh = () => {
    pageNumber = 0;
    setHasMore(true);
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: historyAudio) => {
    // Update optimiste
    removeMutate.mutate([history.id]);
  };

  const handleMultipleHistoryRemove = async () => {
    // update optimiste
    setSelectedHistories([]);
    removeMutate.mutate([...selectedHistories]);
  };

  const handleOnLongPress = async (history: historyAudio) => {
    await removeHistories([history.id]);
  };

  const handleOnPress = async (history: historyAudio) => {
    if (selectedHistories.length === 0) {
      return;
    }
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(id => id !== history.id);
      }
      return [...old, history.id];
    });
  };

  // Pour permettre de gérer le comportemnt en scrollant la liste (fetch les data au fur et à mesure, etc..)
  const handleOnEndReached = async () => {
    if (!data || !hasMore || isFetchingMore) {
      return;
    }
    setIsFetchingMore(true);
    pageNumber += 1;
    const res = await fetchHistories(pageNumber);

    if (!res || !res.length) {
      setHasMore(false);
    }

    const newData = [...data, ...res];
    const finalData: History[] = [];
    const mergedData = newData.reduce((accumulator, current) => {
      const foundObj = accumulator.find(item => item.date === current.date);
      // Si la date d'un historique d'une nouvelle data matche (évitez les doublons)
      if (foundObj) {
        foundObj.audios = foundObj.audios.concat(current.audios);
      } else {
        accumulator.push(current);
      }

      return accumulator;
    }, finalData);

    queryClient.setQueryData(['histories'], mergedData);
    setIsFetchingMore(false);
  };

  React.useEffect(() => {
    // pour enlever la selection des historiques quand tu changes de tab
    const unselectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', unselectHistories);

    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, [navigation]);

  if (isLoading) {
    return <AudioListLoadingUI />;
  }
  return (
    <>
      {selectedHistories.length > 0 ? (
        <Pressable
          onPress={handleMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      ) : null}
      <PaginatedList
        ListEmptyComponent={<EmptyRecords title="There is no history." />}
        onEndReached={handleOnEndReached}
        refreshing={isFetching}
        onRefresh={handleOnRefresh}
        isFetching={isFetchingMore}
        hasMore={hasMore}
        data={data}
        renderItem={({item}) => {
          return (
            <View key={item.date}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, ind) => {
                  return (
                    <Pressable
                      onPress={() => handleOnPress(audio)}
                      onLongPress={() => handleOnLongPress(audio)}
                      key={audio.id + ind}
                      style={[
                        styles.history,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}>
                      <Text style={styles.historyTitle}>{audio.title}</Text>
                      <Pressable
                        onPress={() => handleSingleHistoryRemove(audio)}>
                        <AntDesign name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
});

export default HistoryTab;
