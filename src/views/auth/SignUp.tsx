import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import React = require('react');
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import {useDispatch} from 'react-redux';
import {updateNotification} from 'src/store/notification';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing !')
    .min(3, 'Invalid name !')
    .required('Name is required !'),
  email: yup
    .string()
    .trim('Email is missing !')
    .email('Invalid email !')
    .required('Email is required !'),
  password: yup
    .string()
    .trim('Password is missing !')
    .min(8, 'Password is too short !')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password is too simple !',
    )
    .required('Password is required !'),
});

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: React.FC<Props> = () => {
  const [secureEntry, setSecureEntry] = React.useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };
  const dispatch = useDispatch();

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      // Pb Android on peut pas utiliser localhost
      const {data} = await client.post('/auth/create', {
        ...values,
      });
      navigation.navigate('Verification', {userInfo: data.user});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    actions.setSubmitting(false);
  };
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormContainer
        heading="Welcome !"
        subHeading="Let's get started by creating your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Name"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="*****"
            label="Password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordVisibility}
          />
          <SubmitBtn title="Sign Up" />
          <View style={styles.linkContainer}>
            <AppLink
              title="I lost my password"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <AppLink
              title="Sign In"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignUp;
