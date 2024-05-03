import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import React = require('react');

interface Props {
  title: string;
}

const SubmitBtn: React.FC<Props> = props => {
  const {handleSubmit, isSubmitting} = useFormikContext();
  return <AppButton busy={isSubmitting} onPress={handleSubmit} title={props.title} />;
};

export default SubmitBtn;
