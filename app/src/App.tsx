import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { AppStateStatus, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MenuProvider } from 'react-native-popup-menu';

import { io } from 'socket.io-client';

import RootNavigator from './RootNavigator';
import useAppState from './hooks/useAppState';
import useUserStore from '@store/user.store';
import { SocketContext } from './socket';
import { API_URL, SOCKET_PATH, SOCKET_URL } from 'react-native-dotenv';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 }, mutations: {} },
});

const App = () => {
  const token = useUserStore(state => state.user?.token);
  useAppState(onAppStateChange);

  const sc = useMemo(() => {
    sc?.off('connect');
    sc?.off('disconnect');

    if (token) {
      const socket = io(SOCKET_URL, {
        path: '/socket',
        reconnectionDelayMax: 10000,
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket?.on('connect', () => {
        console.log('con');
      });
      socket?.on('disconnect', () => {
        console.log('dis');
      });

      return socket;
    }
  }, [token, API_URL]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MenuProvider>
          <SocketContext.Provider value={sc}>
            <RootNavigator />
            <Toast />
          </SocketContext.Provider>
        </MenuProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
