import ProfileSettings from '@components/profile/ProfileSettings';
import UpdateAudio from '@components/profile/UpdateAudio';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '@views/Profile';
import Verification from '@views/auth/Verification';
import React = require('react');
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

const Stack = createNativeStackNavigator<ProfileNavigatorStackParamList>();

interface Props {}

const ProfileNavigator: React.FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="UpdateAudio" component={UpdateAudio} />

    </Stack.Navigator>
  );
};

export default ProfileNavigator;
