import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {CloudMessaging_RequestPermission} from '../../firebase';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setUserId} from '../../store/user/userSlices';
import {ReelItem, reelsData} from '../../utils/dummyData';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import GlobalIcon from '../../components/GlobalIcon';

const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.userSlices.userId);
  const [visibleItem, setVisibleItem] = useState<string | null>(null);
  const [likes, setLikes] = useState<{[key: string]: number}>({
    '1': 0,
    '2': 0,
    '3': 0,
  });

  const saveUserTokenToFirestore = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('Users').doc(userId);
        const docSnapshot = await userRef.get();
        if (docSnapshot?.exists) {
          await userRef.update({
            token: fcmToken,
          });
        } else {
          await userRef.set({
            email: user.email,
            uid: user.uid,
            token: fcmToken,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        }

        console.log('Token saved to Firestore');
      } else {
        console.warn('No authenticated user found.');
      }
    } catch (error) {
      console.error('Error saving token to Firestore:', error);
    }
  };

  useEffect(() => {
    CloudMessaging_RequestPermission();
    saveUserTokenToFirestore();
  }, []);

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setVisibleItem(viewableItems[0].item.id);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const renderItem = ({item}: {item: ReelItem}) => (
    <View style={styles.reelContainer}>
      <Video
        source={{uri: item.videoUrl}}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={visibleItem !== item.id}
        muted={false}
      />
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => handleLike(item.id)}>
          <GlobalIcon library="Ionicons" name="heart" size={30} color="#fff" />
          <Text style={styles.likeCount}>{likes[item.id]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text onPress={() => dispatch(setUserId(''))} style={styles.title}>
          Reels
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('NotificationScreen')}>
            <GlobalIcon
              library="Ionicons"
              name="notifications"
              size={24}
              color="#000"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('ChatScreen')}>
            <GlobalIcon
              library="Ionicons"
              name="chatbubble-sharp"
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={reelsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatButton: {
    padding: 8,
  },
  reelContainer: {
    width: width,
    height: height - 100, // Adjust for header
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'center',
  },
  likeButton: {
    alignItems: 'center',
  },
  likeCount: {
    color: '#fff',
    marginTop: 4,
  },
});

export default HomeScreen;
