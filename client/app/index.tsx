import { useEffect } from 'react';
import { router, useNavigationContainerRef } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/homepage');
    }, 100); // small delay to wait for layout

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
