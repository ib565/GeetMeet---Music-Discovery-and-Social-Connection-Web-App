import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({ user_id: '', username: '' });
  let navigate = useNavigate();

  const handleNameClick = (userId) => {
    navigate(`/user/${userId}`);
  };

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
      <a onClick={() => handleNameClick(userInfo.user_id)}>Hey, {userInfo.name}</a>
    </div>
  );
};

export default UserInfo;
