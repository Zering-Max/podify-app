import AudioForm from '@components/form/AudioForm';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQueryClient} from '@tanstack/react-query';
import {calculateUploadProgress} from '@utils/math';
import React from 'react';
import {useDispatch} from 'react-redux';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio: React.FC<Props> = props => {
  const {audio} = props.route.params;

  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleUpadate = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});

      await client.patch(`/audio/${audio.id}`, formData, {
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

      queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
      navigate('Profile');
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  return (
    <AudioForm
      initialValues={{
        title: audio.title,
        category: audio.category,
        about: audio.about,
      }}
      onSubmit={handleUpadate}
      busy={busy}
      progress={uploadProgress}
    />
  );
};

export default UpdateAudio;
