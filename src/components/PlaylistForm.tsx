import React = require('react');
import {Pressable, StyleSheet, Text, View} from 'react-native';
import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {TextInput} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  initialValue?: PlaylistInfo;
  onRequestClose(): void;
  onSubmit(value: PlaylistInfo): void;
}

const PlaylistForm: React.FC<Props> = ({
  visible,
  onRequestClose,
  onSubmit,
  initialValue,
}) => {
  const [isForUpdate, setIsForUpdate] = React.useState(false);
  const [playlistInfo, setPlaylistInfo] = React.useState({
    title: '',
    private: false,
  });
  const handleClose = () => {
    setPlaylistInfo({
      title: '',
      private: false,
    });
    onRequestClose();
  };
  const handleSubmit = () => {
    onSubmit(playlistInfo);
    handleClose();
  };

  React.useEffect(() => {
    if (initialValue) {
      setPlaylistInfo({...initialValue});
      setIsForUpdate(true);
    }
  }, [initialValue]);
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput
          onChangeText={text => setPlaylistInfo({...playlistInfo, title: text})}
          placeholder="title"
          style={styles.input}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() =>
            setPlaylistInfo({...playlistInfo, private: !playlistInfo.private})
          }
          style={styles.privateSelector}>
          {playlistInfo.private ? (
            <MaterialComIcon name="radiobox-marked" color={colors.PRIMARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.PRIMARY} />
          )}
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitBtnText}>
            {isForUpdate ? 'Update' : 'Create'}
          </Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: colors.PRIMARY,
    fontWeight: '700',
  },
  input: {
    height: 45,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: colors.PRIMARY,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.PRIMARY,
    marginLeft: 5,
  },
  submitButton: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.PRIMARY,
    borderRadius: 7,
  },
  submitBtnText: {
    color: colors.PRIMARY,
  },
});

export default PlaylistForm;
