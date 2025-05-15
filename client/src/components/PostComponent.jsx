import { useState, useRef, useContext, useEffect } from "react";
import userPhoto from "../assets/profile_pic.jpeg";
import { AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { BiMessageRounded } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import { PostContext } from "../context/PostContext";
import PropTypes from "prop-types";
import CommentSectionComponent from "./CommentSectionComponent";

const PostComponent = ({
  name,
  username,
  post,
  likes,
  postid,
  postuserid,
  mediaPath,
  likedBy = [],
}) => {
  const { setIsPosted } = useContext(PostContext);
  const dropDownRef = useRef();
  const userid = localStorage.getItem("userid");
  const [dropdown, setDropdown] = useState(false);
  const [userpic, setUserPic] = useState();
  const [postImage, setPostImage] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  window.addEventListener("click", (e) => {
    if (e.target !== dropDownRef.current?.childNodes[0]) {
      setDropdown(false);
    }
  });
  if (!userpic) {
    setUserPic(userPhoto);
  }
  useEffect(() => {
    const getUserPic = async () => {
      try {
        const res = await fetch("https://randomuser.me/api/");
        if (res.ok) {
          const data = await res.json();
          setUserPic(data.results[0].picture.large);
        } else {
          setUserPic(userPhoto);
        }
      } catch (error) {
        console.log("Error while fetching user pic: ", error);
      }
    };
    getUserPic();
    
    // Check if current user has already liked this post
    if (Array.isArray(likedBy) && userid) {
      setHasLiked(likedBy.includes(userid));
    }
  }, [likedBy, userid]);

  useEffect(() => {
    const fetchPostImage = async () => {
      try {
        if (mediaPath) {
          const res = await fetch(
            `http://localhost:5500/uploads/${mediaPath}`
          );
          if (res.ok) {
            setPostImage(URL.createObjectURL(await res.blob()));
          }
        }
      } catch (error) {
        console.log("Error while fetching post image: ", error);
      }
    };

    fetchPostImage();
  }, [mediaPath]);
  
  // Fetch comment count
  const fetchCommentCount = async () => {
    try {
      const res = await fetch(`http://localhost:5500/comments/${postid}`);
      if (res.ok) {
        const comments = await res.json();
        setCommentCount(comments.length);
      }
    } catch (error) {
      console.log("Error fetching comment count:", error);
    }
  };
  
  useEffect(() => {
    fetchCommentCount();
  }, [postid]);
  
  // Handle comment count update from CommentSectionComponent
  const handleCommentUpdate = (count) => {
    setCommentCount(count);
  };

  const handledelete = async () => {
    try {
      const res = await fetch("http://localhost:5500/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postid,
        }),
      });
      if (res.ok) {
        setIsPosted(1);
      } else {
        console.log(await res.text());
      }
    } catch (error) {
      console.log("Error while deleting post: ", error);
    }
  };

  const handleLike = async () => {
    const userid = localStorage.getItem('userid');
    if (!userid) {
      alert('Please log in to like posts');
      return;
    }
    
    // If user has already liked the post, don't make the API call
    if (hasLiked) {
      alert('You have already liked this post');
      return;
    }

    try {
      const res = await fetch("http://localhost:5500/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postid,
          userid,
        }),
      });

      if (res.ok) {
        // Update UI immediately without waiting for server refresh
        setHasLiked(true);
        setIsPosted(1);
      } else {
        const errorText = await res.text();
        if (res.status === 400 && errorText === 'You have already liked this post') {
          alert('You have already liked this post');
          setHasLiked(true); // Update UI state to reflect the server state
        } else {
          console.log(errorText);
        }
      }
    } catch (error) {
      console.log("Error while liking post: ", error);
    }
  };

  return (
    <div className="w-full bg-black text-white border border-gray-800 rounded-md flex p-4 gap-4 min-h-[150px]">
      <div className="h-16 w-24">
        <img
          src={userpic}
          className="rounded-[50%] object-cover"
          alt="Profile"
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <span className="font-semibold">{name}</span>
            <span className="text-[#565a5e]">@{username}</span>
          </div>
          {postuserid == userid && (
            <div className="flex cursor-pointer relative items-center p-2">
              <div
                className="dropbtn"
                onClick={() => {
                  setDropdown(!dropdown);
                }}
              >
                <span ref={dropDownRef}>
                  <CiMenuKebab />
                </span>
              </div>
              {dropdown && (
                <div className="shadow-md shadow-slate-800 p-4 rounded-md flex flex-col gap-4 bg-black border border-gray-800 absolute top-0 right-5">
                  <div className="flex items-center gap-2">
                    <FiEdit2 className="w-[13px]" />
                    <span className="font-semibold text-xs">Edit</span>
                  </div>
                  <div className="bg-[#565a5e] w-full h-[1px]"></div>
                  <div
                    className="flex items-center gap-2"
                    onClick={handledelete}
                  >
                    <AiOutlineDelete className="w-[13px]" />
                    <span className="font-semibold text-xs">Delete</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>{post}</div>
        {postImage && (
          <div className="h-[350px] w-full">
            <img
              src={postImage}
              alt="Post"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex gap-4 text-[#565a5e]">
          <div 
            className="flex items-center justify-center gap-2 cursor-pointer hover:scale-110"
            onClick={() => setShowComments(!showComments)}
          >
            <BiMessageRounded />
            <span>{commentCount}</span>
          </div>
          <div className="flex items-center justify-center gap-2 cursor-pointer hover:scale-110"
               onClick={handleLike}>
            {hasLiked ? (
              <AiOutlineLike className="text-[#1d9bf0]" />
            ) : (
              <AiOutlineLike />
            )}
            {likes ? <span>{likes}</span> : <span>0</span>}
          </div>
          <div className="flex items-center justify-center gap-2">
            <PiShareFatLight />
            <span>Share</span>
          </div>
        </div>
        {showComments && (
          <CommentSectionComponent 
            postid={postid} 
            userid={userid} 
            onCommentUpdate={handleCommentUpdate}
          />
        )}
      </div>
    </div>
  );
};

PostComponent.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  post: PropTypes.string,
  likes: PropTypes.number,
  postid: PropTypes.string, // MongoDB uses string IDs
  postuserid: PropTypes.string, // MongoDB uses string IDs
  mediaPath: PropTypes.string,
};

export default PostComponent;
