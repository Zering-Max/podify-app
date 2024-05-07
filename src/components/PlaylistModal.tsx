import React = require('react');
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import BasicModalContainer from '@ui/BasicModalContainer';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '@utils/colors';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  list: Playlist[];
  onCreateNewPress(): void;
  onPlaylistPress(item: Playlist): void;
}

interface ListItemProps {
  title: string;
  icon: React.ReactNode;
  onPress?(): void;
}

const ListItem: React.FC<ListItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.listItemContainer}>
      {icon}
      <Text style={styles.listItemTitle}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: React.FC<Props> = ({
  visible,
  onRequestClose,
  list,
  onCreateNewPress,
  onPlaylistPress,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map(item => {
          return (
            <ListItem
              onPress={() => onPlaylistPress(item)}
              key={item.id}
              icon={
                <FontAwesomeIcon
                  size={20}
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  color={colors.PRIMARY}
                />
              }
              title={item.title}
            />
          );
        })}
      </ScrollView>
      <ListItem
        icon={<AntDesign size={20} name="plus" color={colors.PRIMARY} />}
        title="Create new"
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  listItemContainer: {flexDirection: 'row', alignItems: 'center', height: 45},
  listItemTitle: {fontSize: 16, color: colors.PRIMARY, marginLeft: 5},
});

export default PlaylistModal;
