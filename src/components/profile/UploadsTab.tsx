import OptionsModal from '@components/OptionsModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React = require('react');
import {ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '@utils/colors';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import OptionSelector from '@ui/OptionSelector';

interface Props {}

const UploadsTab: React.FC<Props> = () => {
  const {data, isLoading} = useFetchUploadsByProfile();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);
  const [showOptions, setShowOptions] = React.useState(false);
  const [selectedAudio, setSelectedAudio] = React.useState<AudioData>();

  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);
    if (selectedAudio) {
      navigate('UpdateAudio', {
        audio: selectedAudio,
      });
    }
  };

  if (isLoading) {
    return <AudioListLoadingUI />;
  }
  if (!data) {
    return <EmptyRecords title="There is no audio." />;
  }
  return (
    <>
      <ScrollView style={styles.container}>
        {data?.map(item => {
          return (
            <AudioListItem
              onPress={() => onAudioPress(item, data)}
              key={item.id}
              audio={item}
              isPlaying={onGoingAudio?.id === item.id}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        })}
      </ScrollView>
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default UploadsTab;
