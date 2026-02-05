import React, { useEffect, useState } from 'react';
import { Badge, Button } from '@mui/material';

const Notifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('ws://your-websocket-server-url');
    
    socket.onmessage = (event) => {
      setNotificationCount((prevCount) => prevCount + 1);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Badge badgeContent={notificationCount} color="secondary">
      <Button color="inherit">Notifications</Button>
    </Badge>
  );
};

export default Notifications;
