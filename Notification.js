import React, { useState } from 'react';
import '../CSS/Notification.css';
import Navbar from "./Navbar"; // Import Navbar component

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome To Destiny Dive!', read: false },
    { id: 2, message: 'Profile updated successfully.', read: false },
    { id: 3, message: 'New Scholarship details Available!!', read: false },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <>
      <Navbar /> {/* Add Navbar component */}
      <div className="notification-container">
        <div className="notification-header">
          <h2>
            Notifications <i className="fas fa-bell"></i> {/* Bell icon */}
          </h2>
        </div>
        <ul className="notification-list">
          {notifications.map(notification => (
            <li key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
              <p>{notification.message}</p>
              {!notification.read && (
                <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Notification;
