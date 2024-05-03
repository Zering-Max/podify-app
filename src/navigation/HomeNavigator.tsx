import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@views/Home';
import PublicProfile from '@views/PublicProfile';
import React = require('react');
import {HomeNavigatorStackParamList} from 'src/@types/navigation';

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

interface Props {}

const HomeNavigator: React.FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
