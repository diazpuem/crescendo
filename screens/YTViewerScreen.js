import { StyleSheet, View } from 'react-native';
import { useContext, useLayoutEffect } from 'react';

import CustomClickableIcon from '../components/CustomClickableIcon';
import React from 'react';
import { WebView } from 'react-native-webview';

const YTViewerScreen = ({ navigation, route }) => {
  let video = null;
  let videoId = null;
  let lockedMode = route.params?.lockedMode
  if (lockedMode) {
    videoId = route.params.videoId;
  } else {
    video = route.params?.video;
    videoId = video.id.videoId;
  }
  
  let videoIsSaved = false;

// ACTUALIZAR LOGICA PARA QUITAR VIDEO AGREGADO

  function changePlayLaterStatusHandler() {
    // hacer el else de esto para quitar
    if (!videoIsSaved) {
        navigation.navigate("Add Song", video);
      }
  }

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => {
        if (lockedMode) {
          return(
            <CustomClickableIcon
              icon="arrow-back"
              onPress={() => navigation.goBack()}
              size={24}
              style={{ color: "#0041C3" , marginRight: 10 }}
            />
          );
        } else {
          return (
            <CustomClickableIcon
              icon={videoIsSaved ? 'bookmark' : 'bookmark-outline'}
              color='blue'
              onPress={changePlayLaterStatusHandler}
              style={{ color: "#0041C3" , marginRight: 10 }}
            />
          );
        }
      },
    });
  }, [navigation, changePlayLaterStatusHandler]);

  return (
    <View style={styles.screen}>
      <WebView
        javaScriptEnabled
        domStorageEnabled
        source={{
          uri: `https://www.youtube.com/embed/${videoId}`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default YTViewerScreen;
