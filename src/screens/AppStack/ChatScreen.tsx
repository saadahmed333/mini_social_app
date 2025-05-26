import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setAllUsers, User} from '../../store/user/userSlices';
import {useNavigation} from '@react-navigation/native';
import GlobalIcon from '../../components/GlobalIcon';

const ChatScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(state => state.userSlices.allUsers);
  const userId = useAppSelector(state => state.userSlices.userId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .onSnapshot(
        querySnapshot => {
          const users: User[] = [];
          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          dispatch(setAllUsers(users));
          setLoading(false);
        },
        error => {
          console.error(error);
          setLoading(false);
        },
      );

    return () => subscriber();
  }, []);

  const handleUserPress = (user: User) => {
    navigation.navigate('MessageScreen', {
      selectedUser: user,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderUser = ({item}: {item: User}) => (
    <Pressable onPress={() => handleUserPress(item)} style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </Pressable>
  );

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
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerRight} />
      </View>
      <FlatList
        data={allUsers?.filter((user: User) => user?.key != userId)}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
});
