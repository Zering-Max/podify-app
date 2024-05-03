import colors from '@utils/colors';
import React = require('react');
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  visible?: boolean;
  onRequestClose?(): void;
  children: React.ReactNode;
}

const BasicModalContainer: React.FC<Props> = ({
  visible,
  onRequestClose,
  children,
}) => {
  return (
    <Modal onRequestClose={onRequestClose} visible={visible} transparent>
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onRequestClose} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.CONTRAST,
  },
});

export default BasicModalContainer;
