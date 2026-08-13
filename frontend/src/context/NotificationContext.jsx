import React, { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to VisionOCR', message: 'Get started by uploading an image.', unread: true, date: new Date() },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const addNotification = (notif) => {
    setNotifications(prev => [{...notif, id: Date.now(), unread: true, date: new Date()}, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearNotifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
