import React, { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import CommentComponent from './CommentComponent';

const CommentSectionContainer = tw.div`
  mt-3
  border-t border-gray-200
  dark:border-gray-700
  pt-3
`;

const CommentForm = tw.form`
  flex items-center
  mb-4
`;

const CommentInput = tw.input`
  flex-grow
  p-1
  sm:p-2
  text-sm
  sm:text-base
  border border-gray-300 rounded-l-md
  dark:border-gray-600 dark:bg-gray-800 dark:text-white
  focus:outline-none focus:ring-2 focus:ring-[#1d9bf0]
`;

const CommentButton = tw.button`
  bg-[#1d9bf0] text-white
  px-2 sm:px-4 py-1 sm:py-2
  text-sm sm:text-base
  rounded-r-md
  hover:bg-[#1a8cd8]
  transition-colors
  disabled:bg-[#1a8cd8]
`;
const CommentsList = tw.div`
  max-h-60
  overflow-y-auto
`;

const CommentCount = tw.div`
  text-sm text-gray-500
  mb-2
`;

const CommentSectionComponent = ({ postid, userid, onCommentUpdate }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://pulse-post.onrender.com/comments/${postid}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        // Notify parent component about comment count change
        if (onCommentUpdate) {
          onCommentUpdate(data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postid]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('https://pulse-post.onrender.com/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postid,
          userid,
          comment: commentText,
        }),
      });

      if (res.ok) {
        setCommentText('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentid) => {
    try {
      const res = await fetch('https://pulse-post.onrender.com/deletecomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentid,
        }),
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <CommentSectionContainer>
      <CommentCount>{comments.length} Comments</CommentCount>
      
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentInput
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={loading}
        />
        <CommentButton type="submit" disabled={loading || !commentText.trim()}>
          {loading ? 'Posting...' : 'Post'}
        </CommentButton>
      </CommentForm>
      
      <CommentsList>
        {comments.map((comment) => (
          <CommentComponent
            key={comment.commentid}
            comment={comment}
            currentUser={userid}
            onDelete={handleDeleteComment}
          />
        ))}
      </CommentsList>
    </CommentSectionContainer>
  );
};

export default CommentSectionComponent;
