import React, { useState } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How are you?" },
    { id: 2, content: "Let's catch up soon." }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    setMessages([...messages, { id: messages.length + 1, content: newMessage }]);
    setNewMessage("");
  };

  return (
    <Container>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText primary={message.content} />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Type a message"
        variant="outlined"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>
        Send Message
      </Button>
    </Container>
  );
};

export default Messages;
