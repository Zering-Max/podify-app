import colors from '@utils/colors';
import React = require('react');
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

interface Props {
  icon: React.ReactNode;
  btnTitle: string;
  style?: StyleProp<ViewStyle>;
  onSelect(file: DocumentPickerResponse): void;
  options: DocumentPickerOptions<SupportedPlatforms>;
}

const FileSelector: React.FC<Props> = props => {
  const handleDocumentSelect = async () => {
    try {
      const document = await DocumentPicker.pick(props.options);
      const file = document[0];
      props.onSelect(file);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };
  return (
    <Pressable
      onPress={handleDocumentSelect}
      style={[styles.btnContainer, props.style]}>
      <View style={styles.itemContainer}>{props.icon}</View>
      <Text style={styles.btnTitle}>{props.btnTitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    color: colors.CONTRAST,
    marginTop: 5,
  },
});

export default FileSelector;
