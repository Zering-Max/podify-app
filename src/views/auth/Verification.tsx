import React = require('react');
import {Keyboard, StyleSheet, TextInput, View, Text} from 'react-native';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AuthStackParamList,
  ProfileNavigatorStackParamList,
} from 'src/@types/navigation';
import client from 'src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '@utils/colors';
import catchAsyncError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {useDispatch} from 'react-redux';
import ReVerifcationLink from '@components/ReVerificationLink';

type Props = NativeStackScreenProps<
  AuthStackParamList | ProfileNavigatorStackParamList,
  'Verification'
>;

type PossibleScreens = {
  ProfileSettings: undefined;
  SignIn: undefined;
};

const otpFields = new Array(6).fill('');

const Verification: React.FC<Props> = props => {
  const [otp, setOtp] = React.useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<PossibleScreens>>();

  const {userInfo} = props.route.params;

  const inputRef = React.useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    if (value === 'Backspace') {
      if (!newOtp[index]) {
        setActiveOtpIndex(index - 1);
      }
      newOtp[index] = '';
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }
    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) {
      return dispatch(
        updateNotification({message: 'Invalid OTP !', type: 'error'}),
      );
    }
    setSubmitting(true);
    try {
      const {data} = await client.post('auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      dispatch(updateNotification({message: data.message, type: 'success'}));
      const {routeNames} = navigation.getState();

      if (routeNames.includes('SignIn')) {
        navigation.navigate('SignIn');
      }
      if (routeNames.includes('ProfileSettings')) {
        navigation.navigate('ProfileSettings');
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
    setSubmitting(false);
  };

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);
  // 123456 TODO otp paste ne marche que sur iOS
  return (
    <AuthFormContainer heading="Please look in to your email !">
      <View style={styles.inputContainer}>
        {otpFields.map((_, index) => {
          return (
            <OTPField
              ref={activeOtpIndex === index ? inputRef : null}
              key={index}
              placeholder="*"
              onKeyPress={({nativeEvent}) => {
                handleChange(nativeEvent.key, index);
              }}
              onChangeText={handlePaste}
              keyboardType="numeric"
              value={otp[index] || ''}
              // autoComplete="one-time-code"
            />
          );
        })}
      </View>
      <AppButton busy={submitting} onPress={handleSubmit} title="Submit" />
      <View style={styles.linkContainer}>
        <ReVerifcationLink linkTitle="Re-send OTP" userId={userInfo.id} />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'flex-end',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default Verification;
