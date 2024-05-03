import React = require('react');
import {Image, StyleSheet, View} from 'react-native';
import EnryoIcon from 'react-native-vector-icons/Entypo';
import colors from '@utils/colors';

interface Props {
  source?: string;
}

const avatarSize = 70;

const AvatarField: React.FC<Props> = props => {
  return (
    <View>
      {props.source ? (
        <Image source={{uri: props.source}} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarImage}>
          <EnryoIcon name="mic" size={30} color={colors.PRIMARY} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.CONTRAST,
  },
});

export default AvatarField;
