import React, { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { FiSearch } from 'react-icons/fi';

const Container = tw.div`
  w-full
  sm:w-2/5
  md:w-1/3
  h-full
  border-r border-gray-700
  flex flex-col
`;

const Header = tw.div`
  p-4
  border-b border-gray-700
  flex flex-col gap-3
`;

const Title = tw.h2`
  text-xl font-bold
`;

const SearchContainer = tw.div`
  flex items-center
  bg-gray-800
  rounded-full
  px-3 py-2
`;

const SearchInput = tw.input`
  bg-transparent
  border-none
  outline-none
  flex-1
  ml-2
  text-white
`;

const ConversationItem = tw.div`
  p-4
  border-b border-gray-700
  flex items-center
  cursor-pointer
  hover:bg-gray-800
  transition-colors
`;

const ActiveConversationItem = tw(ConversationItem)`
  bg-gray-800
`;

const Avatar = tw.div`
  w-12 h-12
  rounded-full
  bg-[#1d9bf0]
  flex items-center justify-center
  font-bold text-lg
  mr-3
`;

const UserInfo = tw.div`
  flex-1
`;

const UserName = tw.div`
  font-semibold
`;

const LastMessage = tw.div`
  text-sm text-gray-400
  truncate
`;

const TimeAndBadge = tw.div`
  flex flex-col items-end
  ml-2
`;

const Time = tw.div`
  text-xs text-gray-500
  mb-1
`;

const UnreadBadge = tw.div`
  bg-[#1d9bf0]
  rounded-full
  w-5 h-5
  flex items-center justify-center
  text-xs
`;

const NewChatButton = tw.button`
  bg-[#1d9bf0]
  text-white
  rounded-full
  px-4 py-2
  m-4
  font-semibold
  hover:bg-[#1a8cd8]
  transition-colors
`;

const ConversationList = ({ conversations, onSelectUser, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);
  
  // Fetch all users for new chat
  const fetchUsers = async () => {
    try {
      const res = await fetch('https://pulse-post.onrender.com/users');
      if (res.ok) {
        const data = await res.json();
        // Store all users, we'll filter them when displaying
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
    // Initial fetch of users
    fetchUsers();
  }, []);
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Not today, show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const filteredConversations = conversations.filter(conversation => {
    return conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conversation.username.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const filteredUsers = allUsers.filter(user => {
    // Don't show current user in the list
    const userId = localStorage.getItem('userid');
    if (user._id === userId) return false;
    
    // Filter by search term
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleSelectNewUser = (user) => {
    onSelectUser({
      userId: user._id,
      name: user.name,
      username: user.username,
      lastMessage: '',
      unreadCount: 0
    });
    setShowAllUsers(false);
  };
  
  return (
    <Container>
      <Header>
        <Title>Messages</Title>
        <SearchContainer>
          <FiSearch color="#9CA3AF" />
          <SearchInput 
            placeholder="Search messages" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>
      
      {!showAllUsers ? (
        <>
          <div className="overflow-y-auto flex-1">
            {filteredConversations.length > 0 ? (
              (() => {
                const uniqueConversations = new Map();
                
                filteredConversations.forEach(conversation => {
                  if (!uniqueConversations.has(conversation.userId) || 
                      new Date(conversation.lastMessageTime) > 
                      new Date(uniqueConversations.get(conversation.userId).lastMessageTime)) {
                    uniqueConversations.set(conversation.userId, conversation);
                  }
                });
                
                return Array.from(uniqueConversations.values())
                  .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
                  .map(conversation => {
                    const ItemComponent = conversation.userId === selectedUserId ? 
                      ActiveConversationItem : ConversationItem;
                    
                    return (
                      <ItemComponent 
                        key={conversation.userId}
                        onClick={() => onSelectUser(conversation)}
                      >
                        <Avatar>{getInitials(conversation.name)}</Avatar>
                        <UserInfo>
                          <UserName>{conversation.name}</UserName>
                          <LastMessage>{conversation.lastMessage}</LastMessage>
                        </UserInfo>
                        <TimeAndBadge>
                          <Time>{formatTime(conversation.lastMessageTime)}</Time>
                          {conversation.unreadCount > 0 && (
                            <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                          )}
                        </TimeAndBadge>
                      </ItemComponent>
                    );
                  });
              })()
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </div>
            )}
          </div>
          <NewChatButton onClick={() => setShowAllUsers(true)}>
            New Message
          </NewChatButton>
        </>
      ) : (
        <>
          <div className="p-3 border-b border-gray-700 flex items-center">
            <button 
              className="text-blue-500 mr-2"
              onClick={() => setShowAllUsers(false)}
            >
              Back
            </button>
            <h3 className="font-semibold">New Message</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <ConversationItem 
                  key={user._id}
                  onClick={() => handleSelectNewUser(user)}
                >
                  <Avatar>{getInitials(user.name)}</Avatar>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <LastMessage>@{user.username}</LastMessage>
                  </UserInfo>
                </ConversationItem>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
            )}
          </div>
        </>
      )}
    </Container>
  );
};

export default ConversationList;
