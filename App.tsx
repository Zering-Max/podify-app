import React = require('react');
import {Provider} from 'react-redux';
import store from './src/store/index';
import AppNavigator from 'src/navigation';
import AppContainer from '@components/AppContainer';
import {clearAsyncStorage} from '@utils/asyncStorage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  // clearAsyncStorage().then(() => {
  //   console.log('logged out');
  // });
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
