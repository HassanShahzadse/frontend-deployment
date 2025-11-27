import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const autoLogoutEnabledRef = useRef(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set new timeout if auto logout is enabled
    if (autoLogoutEnabledRef.current) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, TIMEOUT_DURATION);
    }
  };

  const checkAutoLogoutSetting = async () => {
    try {
      const response = await API.get('/api/users/preferences/security');
      autoLogoutEnabledRef.current = response.data.auto_session_timeout === true;
      
      // Start the timer if enabled
      if (autoLogoutEnabledRef.current) {
        resetTimer();
      }
    } catch (error) {
      console.error('Failed to fetch auto logout setting:', error);
    }
  };

  useEffect(() => {
    // Check if auto logout is enabled
    checkAutoLogoutSetting();

    // Event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      if (autoLogoutEnabledRef.current) {
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return { resetTimer, checkAutoLogoutSetting };
};

