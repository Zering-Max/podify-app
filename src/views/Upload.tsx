import React = require('react');
import {getClient} from 'src/api/client';
import {calculateUploadProgress} from '@utils/math';
import catchAsyncError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {useDispatch} from 'react-redux';
import AudioForm from '@components/form/AudioForm';
import {useQueryClient} from '@tanstack/react-query';

interface Props {}

const Upload: React.FC<Props> = () => {
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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
      dispatch(
        updateNotification({message: 'Audio uploaded !', type: 'success'}),
      );
      queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setBusy(false);
  };

  return (
    <AudioForm onSubmit={handleUpload} busy={busy} progress={uploadProgress} />
  );
};

export default Upload;
