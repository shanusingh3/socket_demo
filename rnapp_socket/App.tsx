
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { io } from 'socket.io-client';

// Replace with your IP or ngrok URL
const socket = io('https://warner-shares-asylum-silly.trycloudflare.com', {
  transports: ['websocket'],
  auth: {
    userId: "1",
  },
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('receive_message', data => {
      console.log('Received:', data);

      setMessages(prev => [...prev, data]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('receive_message');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    socket.emit('send_message', {
      toUserId: '2',
      message,
    });

    setMessage('');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.messageContainer}>
      <Text style={styles.message}>{item.message}</Text>

      <Text style={styles.sender}>
        {item.sender || item.senderId}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Socket Chat Demo</Text>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={sendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  messageContainer: {
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },

  message: {
    fontSize: 16,
  },

  sender: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },

  button: {
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
