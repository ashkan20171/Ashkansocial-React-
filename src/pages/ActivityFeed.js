import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const ActivityFeed = () => {
  const activities = [
    "You liked a post",
    "John commented on your post",
    "Sarah sent you a message"
  ];

  return (
    <List>
      {activities.map((activity, index) => (
        <ListItem key={index}>
          <ListItemText primary={activity} />
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityFeed;
