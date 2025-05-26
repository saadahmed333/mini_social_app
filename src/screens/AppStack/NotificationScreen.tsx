import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalIcon from '../../components/GlobalIcon';
import {useAppSelector} from '../../store/hooks';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const userId = useAppSelector(state => state.userSlices.userId);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  console.log(userId, 'userId');

  useEffect(() => {
    if (!userId) return;

    const subscriber = firestore()
      .collection('notifications')
      .where('receiverId', '==', userId)
      .onSnapshot(
        querySnapshot => {
          const updatedNotifications: any[] = [];
          querySnapshot.forEach(doc => {
            updatedNotifications.push({
              ...doc.data(),
              key: doc.id,
            });
          });
          setNotifications(updatedNotifications);
          setLoading(false);
        },
        error => {
          console.error('Firestore error:', error);
          setLoading(false);
        },
      );

    return () => subscriber();
  }, [userId]);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.notificationCard}>
      <GlobalIcon
        library="Ionicons"
        name="notifications"
        size={24}
        color="#4a90e2"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title || 'Notification'}</Text>
        <Text style={styles.message}>
          {item.message || item.notificationMessage}
        </Text>
        {item.createdAt && (
          <Text style={styles.timestamp}>
            {new Date(item.createdAt.toDate()).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <GlobalIcon
            library="Ionicons"
            name="arrow-back"
            size={24}
            color="#000"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f4f6f8',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 40,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 32,
  },
});
