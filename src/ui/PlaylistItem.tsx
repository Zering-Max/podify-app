import colors from '@utils/colors';
import React = require('react');
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Playlist} from 'src/@types/audio';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

interface Props {
  playlist: Playlist;
  onPress?(): void;
  onLongPress?(): void;
}

const PlaylistItem: React.FC<Props> = ({playlist, onPress, onLongPress}) => {
  const {itemsCount, title, visibility} = playlist;
  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.posterContainer}>
        <MaterialComIcon
          name="playlist-music"
          size={30}
          color={colors.CONTRAST}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            name={visibility === 'public' ? 'globe' : 'lock'}
            color={colors.SECONDARY}
            size={15}
          />
          <Text style={styles.count}>
            {itemsCount} {itemsCount > 1 ? 'audios' : 'audio'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
  },
  posterContainer: {
    backgroundColor: colors.OVERLAY,
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: colors.CONTRAST,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  count: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingTop: 4,
    alignItems: 'center',
  },
});

export default PlaylistItem;
