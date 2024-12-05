import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user from session storage
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserEmail(parsedUser.email || 'User');
    }

    // Initial fetch
    fetchNotifications();

    // Set up polling for notifications every 30 seconds
    const pollInterval = setInterval(fetchNotifications, 30000);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar__notification') && !event.target.closest('.navbar__notifications-dropdown')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.navbar__user-menu') && !event.target.closest('.navbar__user-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Cleanup
    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://157.245.105.131:5000/api/notifications');
      const allNotifications = response.data;
      
      // Sort notifications by timestamp
      const sortedNotifications = allNotifications.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(notif => notif.status === 'unread').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.post(`http://157.245.105.131:5000/api/notifications/${notificationId}/status`, {
        status: 'read'
      });

      if (response.data.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, status: 'read' }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
    if (diffInMinutes < 10080) { // 7 days
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
    return date.toLocaleDateString();
  };

  const getNotificationMessage = (notification) => {
    if (!notification || !notification.type || !notification.data) {
      return 'New notification received';
    }

    const { type, data } = notification;
    
    switch (type) {
      case 'threshold_exceeded':
        return `${data.sensor}: ${data.value} exceeded threshold (${data.threshold})`;
      case 'maintenance_alert':
        return `Maintenance needed: ${data.sensor} (${data.value})`;
      case 'pattern_detected':
        return `Pattern detected in ${data.sensor}`;
      case 'efficiency_alert':
        return `Efficiency alert: ${data.sensor}`;
      case 'quality_risk':
        return `Quality risk detected: ${data.sensor}`;
      default:
        return `Alert: ${data.sensor}`;
    }
  };

  const getSeverityClass = (notification) => {
    if (!notification || !notification.data) return 'severity-info';
    
    const severityMap = {
      critical: 'severity-critical',
      high: 'severity-high',
      warning: 'severity-warning',
      info: 'severity-info',
      default: 'severity-info'
    };
    
    const severity = (notification.data.severity || 'default').toLowerCase();
    return severityMap[severity] || severityMap.default;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar__center"></div>
      <div className="navbar__right">
        {/* Notifications Icon */}
        <div
          className="navbar__notification"
          onClick={(e) => {
            e.stopPropagation();
            setShowNotifications(!showNotifications);
            setShowUserMenu(false);
          }}
        >
          <FaBell className="navbar__icon" />
          {unreadCount > 0 && (
            <span className="navbar__notification-count">{unreadCount}</span>
          )}
        </div>

        {/* User Icon */}
        <div
          className="navbar__user-menu"
          onClick={(e) => {
            e.stopPropagation();
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
          }}
        >
          <FaUserCircle className="navbar__icon" />
          <span className="navbar__user-text">{userEmail}</span>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="navbar__notifications-dropdown">
          <div className="navbar__notifications-header">
            <h4>Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</h4>
            <span className="close-button" onClick={() => setShowNotifications(false)}>&times;</span>
          </div>
          <div className="navbar__notifications-content">
            {loading ? (
              <div className="navbar__notification-item loading">Loading notifications...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`navbar__notification-item ${notification.status === 'unread' ? 'unread' : ''} ${getSeverityClass(notification)}`}
                  onClick={() => {
                    if (notification.status === 'unread') {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="notification-content">
                    <p className="notification-message">
                      {getNotificationMessage(notification)}
                    </p>
                    <span className="notification-time">
                      {formatNotificationTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="navbar__notification-item empty">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="navbar__user-dropdown">
          <div className="navbar__user-item" onClick={handleLogout}>
            <FaSignOutAlt className="navbar__logout-icon" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;