import React, { useState, useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';
import { IoSend } from 'react-icons/io5';

const ChatContainer = tw.div`
  flex-1
  flex
  flex-col
  h-full
  w-full
`;

const Header = tw.div`
  p-4
  border-b border-gray-700
  flex items-center
`;

const UserName = tw.h3`
  font-semibold
  text-lg
`;

const Username = tw.span`
  text-gray-400
  text-sm
  ml-2
`;

const MessagesContainer = tw.div`
  flex-1
  p-2
  sm:p-4
  overflow-y-auto
  flex
  flex-col
  gap-2
  sm:gap-3
`;

const MessageBubble = tw.div`
  max-w-[80%]
  sm:max-w-[70%]
  p-2
  sm:p-3
  rounded-lg
  text-white
  text-sm
  sm:text-base
`;

const SentMessage = tw(MessageBubble)`
  bg-[#1d9bf0]
  self-end
  rounded-br-none
`;

const ReceivedMessage = tw(MessageBubble)`
  bg-[#2d3741]
  self-start
  rounded-bl-none
`;

const MessageTime = tw.div`
  text-xs
  text-gray-400
  mt-1
`;

const InputContainer = tw.div`
  p-2
  sm:p-4
  border-t border-gray-700
  flex
  items-center
`;

const MessageInput = tw.input`
  flex-1
  bg-gray-800
  border-none
  outline-none
  rounded-full
  px-4
  py-2
  text-white
`;

const SendButton = tw.button`
  ml-2
  bg-[#1d9bf0]
  w-10 h-10
  rounded-full
  flex items-center justify-center
  text-white
  disabled:bg-[#1a8cd8]
  disabled:cursor-not-allowed
  hover:bg-[#1a8cd8]
  transition-colors
`;

const MessageChat = ({ currentUserId, otherUser, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (currentUserId && otherUser) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 3000);
      return () => clearInterval(intervalId);
    }
  }, [currentUserId, otherUser]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5500/messages/${currentUserId}/${otherUser.userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5500/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentUserId,
          recipient: otherUser.userId,
          content: newMessage,
        }),
      });
      
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
        if (onMessageSent) {
          onMessageSent();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Container>
      <Header>
        <UserName>
          {otherUser.name}
          <Username>@{otherUser.username}</Username>
        </UserName>
      </Header>
      
      <MessagesContainer>
        {messages.length > 0 ? (
          messages.map((message) => {
            const isSentByMe = message.sender === currentUserId;
            const MessageComponent = isSentByMe ? SentMessage : ReceivedMessage;
            
            return (
              <div key={message._id} className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}>
                <MessageComponent>
                  {message.content}
                </MessageComponent>
                <MessageTime>{formatTime(message.created_at)}</MessageTime>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <form onSubmit={handleSendMessage} className="flex w-full">
          <MessageInput
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading || !newMessage.trim()}>
            <IoSend />
          </SendButton>
        </form>
      </InputContainer>
    </Container>
  );
};

export default MessageChat;
