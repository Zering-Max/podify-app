import React = require('react');
import {StyleSheet} from 'react-native';
import colors from '../utils/colors';
import {getClient} from 'src/api/client';
import {calculateUploadProgress} from '@utils/math';
import catchAsyncError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {useDispatch} from 'react-redux';
import AudioForm from '@components/form/AudioForm';

interface Props {}

const Upload: React.FC<Props> = () => {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const dispatch = useDispatch();

  const handleUpload = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const {data} = await client.post('/audio/create', formData, {
        onUploadProgress(progressEvent) {
          const uploaded = calculateUploadProgress({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });
          if (uploaded >= 100) {
            setBusy(false);
          }
          setUploadProgress(Math.floor(uploaded));
        },
      });
      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  return (
    <AudioForm onSubmit={handleUpload} busy={busy} progress={uploadProgress} />
  );
  // return (
  //   <AppView>
  //     <ScrollView style={styles.container}>
  //       <View style={styles.selectorContainer}>
  //         <FileSelector
  //           icon={
  //             <MaterialComIcon
  //               name="image-outline"
  //               size={35}
  //               color={colors.SECONDARY}
  //             />
  //           }
  //           btnTitle="Select Poster"
  //           options={{type: [types.images]}}
  //           onSelect={poster => setAudioInfo({...audioInfo, poster})}
  //         />
  //         <FileSelector
  //           icon={
  //             <MaterialComIcon
  //               name="file-music-outline"
  //               size={35}
  //               color={colors.SECONDARY}
  //             />
  //           }
  //           btnTitle="Select Audio"
  //           style={{marginLeft: 20}}
  //           options={{type: [types.audio]}}
  //           onSelect={file => setAudioInfo({...audioInfo, file})}
  //         />
  //       </View>
  //       <View style={styles.formContainer}>
  //         <TextInput
  //           placeholderTextColor={colors.INACTIVE_CONTRAST}
  //           placeholder="Title"
  //           style={styles.input}
  //           onChangeText={text => setAudioInfo({...audioInfo, title: text})}
  //           value={audioInfo.title}
  //         />
  //         <Pressable
  //           onPress={() => setShowCategoryModal(true)}
  //           style={styles.categorySelector}>
  //           <Text style={styles.categorySelectorTitle}>Category</Text>
  //           <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
  //         </Pressable>
  //         <TextInput
  //           placeholderTextColor={colors.INACTIVE_CONTRAST}
  //           placeholder="About"
  //           style={styles.input}
  //           numberOfLines={10}
  //           multiline
  //           onChangeText={text => setAudioInfo({...audioInfo, about: text})}
  //           value={audioInfo.about}
  //         />
  //         <View style={{marginBottom: 20}} />
  //         <CategorySelector
  //           data={categories}
  //           renderItem={item => {
  //             return <Text style={styles.category}>{item}</Text>;
  //           }}
  //           visible={showCategoryModal}
  //           onRequestClose={() => setShowCategoryModal(false)}
  //           title="Category"
  //           onSelect={item => {
  //             setAudioInfo({...audioInfo, category: item});
  //           }}
  //         />
  //         <View style={{marginVertical: 20}}>
  //           {busy ? <Progress progress={uploadProgress} /> : null}
  //         </View>
  //         <AppButton
  //           busy={busy}
  //           borderRadius={7}
  //           onPress={handleUpload}
  //           title="Submit"
  //         />
  //       </View>
  //     </ScrollView>
  //   </AppView>
  // );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {padding: 10, color: colors.PRIMARY},
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default Upload;
