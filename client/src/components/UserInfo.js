import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({ user_id: '', username: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get_user_info', { withCredentials: true });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="userInfo">
      <p>Hey, {userInfo.name}</p>
    </div>
  );
};

export default UserInfo;
