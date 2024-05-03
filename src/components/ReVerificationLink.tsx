import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import React = require('react');
import {View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import {getClient} from 'src/api/client';
import {getAuthState} from 'src/store/auth';

interface Props {
  time?: number;
  activeAtFirst?: boolean;
  linkTitle: string;
  userId?: string;
}

const ReVerifcationLink: React.FC<Props> = ({
  linkTitle,
  time = 60,
  activeAtFirst = false,
  userId,
}) => {
  const [countDown, setCountDown] = React.useState(time);
  const [canSetNewOtpRequest, setCanSetNewOtpRequest] =
    React.useState(activeAtFirst);
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const {profile} = useSelector(getAuthState);

  const requestForOTP = async () => {
    setCountDown(60);
    setCanSetNewOtpRequest(false);
    try {
      const client = await getClient();
      await client.post('auth/re-verify-email', {
        userId: userId || profile?.id,
      });
      navigate('Verification', {
        userInfo: {
          email: profile?.email || '',
          name: profile?.name || '',
          id: userId || profile?.id || '',
        },
      });
    } catch (error) {
      console.log('request for new otp : ', error);
    }
  };

  React.useEffect(() => {
    if (canSetNewOtpRequest) return;

    const intervalId = setInterval(() => {
      setCountDown(oldCountDown => {
        if (oldCountDown <= 0) {
          setCanSetNewOtpRequest(true);
          clearInterval(intervalId);
          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);
    // Pour bien clean
    return () => {
      clearInterval(intervalId);
    };
  }, [canSetNewOtpRequest]);

  return (
    <View style={styles.container}>
      {countDown > 0 && !canSetNewOtpRequest ? (
        <Text style={styles.countDown}>{countDown} sec</Text>
      ) : null}
      <AppLink
        active={canSetNewOtpRequest}
        title={linkTitle}
        onPress={requestForOTP}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default ReVerifcationLink;
