import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React = require('react');
import AuthNavigator from './AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateProfile,
  updateLoggedInState,
  updateBusyState,
} from 'src/store/auth';
import TabNavigator from './TabNavigator';
import {Keys, getToAsyncStorage} from '@utils/asyncStorage';
import client from 'src/api/client';
import {View, StyleSheet} from 'react-native';
import Loader from '@ui/Loader';
import colors from '@utils/colors';
import RNBootSplash from 'react-native-bootsplash';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const AppNavigator: React.FC<Props> = () => {
  const {loggedIn, busy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getToAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          return dispatch(updateBusyState(false));
        }
        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('auth error :', error);
      }
      dispatch(updateBusyState(false));
    };
    fetchAuthInfo();
  }, [dispatch]);
  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()} theme={AppTheme}>
      {busy ? (
        <View style={styles.loader}>
          <Loader />
        </View>
      ) : null}
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default AppNavigator;
