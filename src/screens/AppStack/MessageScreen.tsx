import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalIcon from '../../components/GlobalIcon';
import {useAppSelector} from '../../store/hooks';
import {useKeyboard} from '../../utils/keyboard';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: number;
}

const MessageScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const {keyboardHeight} = useKeyboard();

  const route: any = useRoute();
  const navigation = useNavigation();
  const selectedUser = route.params?.selectedUser;
  const userId = useAppSelector(state => state.userSlices.userId);

  useEffect(() => {
    if (!userId) return;

    const chatRoomId = [userId, selectedUser?.key].sort().join('_');
    const db = getFirestore();
    const chatRef = doc(db, 'chats', chatRoomId);
    const messagesRef = collection(chatRef, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(messagesQuery, querySnapshot => {
      const messageList: Message[] = [];
      querySnapshot.forEach(doc => {
        messageList.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, selectedUser?.key, navigation]);

  const sendNotification = async (deviceToken: string, data: any) => {
    try {
      const message = {
        to: deviceToken,
        notification: {
          title: data?.title,
          body: data?.notificationMessage,
        },
        data: {},
      };
      await axios.post('https://fcm.googleapis.com/fcm/send', message, {
        headers: {
          Authorization: `key=${'BOS85eb8sxLsKpFrlG1KfPkZTA4XgYsRRnanHYDOMwugBlSlv_r7uWA2yRZ6UGCN07ssiE_OWooGe0AJRFHYk0c'}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const sendMessage = async () => {
    if (!userId || newMessage.trim().length === 0) return;

    const chatRoomId = [userId, selectedUser?.key].sort().join('_');
    const db = getFirestore();
    const chatRef = doc(db, 'chats', chatRoomId);
    const messagesRef = collection(chatRef, 'messages');

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: userId,
        createdAt: serverTimestamp(),
      });

      await firestore().collection('notifications').add({
        email: selectedUser.email,
        name: selectedUser.name,
        receiverId: selectedUser.key,
        senderId: userId,
        token: selectedUser.token,
        message: newMessage,
        createdAt: serverTimestamp(),
      });
      const data = {
        title: selectedUser?.name,
        notificationMessage: newMessage,
      };
      setNewMessage('');
      sendNotification(selectedUser.token, data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isCurrentUser = item.senderId === userId;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
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
        <Text style={styles.headerTitle}>{selectedUser?.name}</Text>
        <View style={styles.headerRight} />
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
        style={styles.messageList}
      />
      <View
        style={[
          styles.inputContainer,
          {
            marginBottom: keyboardHeight + 30,
          },
        ]}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    color: '#000',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default MessageScreen;
