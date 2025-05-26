import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export const CloudMessaging_RequestPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to show notifications',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'ios') {
    messaging()
      .requestPermission()
      .then(res => {
        console.log('Notification permission granted', res);
        return res;
      })
      .catch(error => {
        console.error('Notification permission error: ', error);
      });
  }
};

export const CloudMessaging_OnMessage = () =>
  messaging().onMessage(async remoteMessage => {
    inAppNotification(remoteMessage);
  });

export const CloudMessaging_GetToken = async () => {
  const token = await messaging().getToken();
  return token;
};

const inAppNotification = async (remoteMessage: any) => {
  await notifee.requestPermission();

  try {
    const channelId = await notifee.createChannel({
      id: 'main',
      name: 'Main',
      sound: 'default',
      vibration: false,
      badge: true,
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage,
      android: {
        smallIcon: 'ic_launcher',
        color: 'white',
        largeIcon: 'test',
        sound: 'default',
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.log(error, 'error notit');
  }
};

// const handleNotifications = async (navigation: any, data: any) => {
//   if (data?.type == 'like' || data?.type == 'comment') {
//     socket.emit('join-post', data?.post);
//     store.dispatch(savePostDetails(null));
//     navigation.navigate(SCREEN.POST_DETAILS, {
//       post: {},
//       postId: data?.post,
//       bookmarkedPost: false,
//     });
//   } else if (data?.type == 'chat-accept' || data?.type == 'chat-request') {
//     const res = await store.dispatch(getChats({id: data?.chat})).unwrap();
//     if (res?.success === true) {
//       navigation.navigate(SCREEN.SENDMESSAGE, {request: true});
//     }
//   } else if (data?.type == 'message') {
//     const res = await store.dispatch(getChats({id: data?.chat})).unwrap();
//     if (res?.success === true) {
//       navigation.navigate(SCREEN.SENDMESSAGE, {request: false});
//     }
//   } else if (data?.type == 'follow') {
//     if (data?.sender) {
//       const res = await store.dispatch(getProfile(data?.sender)).unwrap();
//       if (res?.success === true) {
//         navigation.navigate(SCREEN.USERPROFILE);
//       }
//     }
//   } else {
//     navigation.navigate(SCREEN.BOTTOM);
//   }
// };

// export const notificationActions = (navigation: any) => {
//   messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
//     console.log(remoteMessage, 'onNotificationOpenedApp');
//     if (remoteMessage) {
//       const data = remoteMessage?.data;
//       handleNotifications(navigation, data);
//     }
//   });
//   messaging()
//     .getInitialNotification()
//     .then(async (remoteMessage: any) => {
//       console.log(remoteMessage, 'getInitialNotification');
//       if (remoteMessage) {
//         const data = remoteMessage?.data;
//         handleNotifications(navigation, data);
//       }
//     });
//   notifee.onForegroundEvent(async ({type, detail}: any) => {
//     const data = detail?.notification?.data?.data;
//     if (type === EventType.PRESS) {
//       handleNotifications(navigation, data);
//     }
//   });
//   notifee.onBackgroundEvent(async ({type, detail}: any) => {
//     const data = detail?.notification?.data?.data;
//     if (type === EventType.PRESS) {
//       handleNotifications(navigation, data);
//     }
//   });
// };
