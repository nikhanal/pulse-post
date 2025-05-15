import React from 'react';
import tw from 'tailwind-styled-components';

const CommentContainer = tw.div`
  flex flex-col
  p-3
  border-b border-gray-200
  dark:border-gray-700
`;

const CommentHeader = tw.div`
  flex items-center justify-between
  mb-1
`;

const UserInfo = tw.div`
  flex items-center
`;

const Username = tw.span`
  font-semibold text-sm
  mr-2
`;

const Name = tw.span`
  text-gray-500 text-xs
`;

const DeleteButton = tw.button`
  text-[#1d9bf0] text-xs
  hover:text-[#1a8cd8]
  transition-colors
`;

const CommentText = tw.p`
  text-sm
  mb-1
`;

const CommentTime = tw.span`
  text-gray-500 text-xs
`;

const CommentComponent = ({ comment, currentUser, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <CommentContainer>
      <CommentHeader>
        <UserInfo>
          <Username>@{comment.username}</Username>
          <Name>{comment.name}</Name>
        </UserInfo>
        {currentUser && currentUser === comment.userid && (
          <DeleteButton onClick={() => onDelete(comment.commentid)}>
            Delete
          </DeleteButton>
        )}
      </CommentHeader>
      <CommentText>{comment.comment}</CommentText>
      <CommentTime>{formatDate(comment.created_at)}</CommentTime>
    </CommentContainer>
  );
};

export default CommentComponent;
