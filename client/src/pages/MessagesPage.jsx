import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConversationList from '../components/ConversationList';
import MessageChat from '../components/MessageChat';
import { SideBarComponent } from '../components/SideBarComponent';
import userPhoto from '../assets/profile_pic.jpeg';
import tw from 'tailwind-styled-components';

const MessagesContainer = tw.div`
  flex
  w-full
  md:w-[85%]
  lg:w-[75%]
  xl:w-[60%]
  mx-auto
  h-[calc(100vh-40px)]
  mt-4
  md:mt-10
  border border-gray-800
  rounded-lg
  overflow-hidden
`;

const MessagesPage = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetchConversations();
    const intervalId = setInterval(fetchConversations, 5000);
    return () => clearInterval(intervalId);
  }, [userId, navigate]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://pulse-post.onrender.com/conversations/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleMessageSent = () => {
    // Refresh conversations after sending a message
    fetchConversations();
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <SideBarComponent image={<img src={userPhoto} className="w-6 h-6 rounded-full" />} />
      <MessagesContainer>
        <ConversationList 
          conversations={conversations} 
          onSelectUser={handleSelectUser} 
          selectedUserId={selectedUser?.userId}
        />
        {selectedUser ? (
          <MessageChat 
            currentUserId={userId} 
            otherUser={selectedUser} 
            onMessageSent={handleMessageSent}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </MessagesContainer>
    </div>
  );
};

export default MessagesPage;
