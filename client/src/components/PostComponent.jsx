import { useState, useRef, useContext } from "react";
import userpic from "../assets/profile_pic.jpeg";
import { AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { BiMessageRounded } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import { PostContext } from "../context/PostContext";
import PropTypes from "prop-types";
const PostComponent = ({ name, username, post, likes, postid, postuserid }) => {
  const { setIsPosted } = useContext(PostContext);
  const dropDownRef = useRef();
  const userid = localStorage.getItem("userid");
  const [dropdown, setDropdown] = useState(false);
  window.addEventListener("click", (e) => {
    if (e.target !== dropDownRef.current?.childNodes[0]) {
      setDropdown(false);
    }
  });

  // const handledelete = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5500/delete", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         postid,
  //       }),
  //     });
  //   } catch (error) {
  //     console.log("Error while deleting post: ", error);
  //   }
  // };
  const handleLike = async () => {
    try {
      const res = await fetch("http://localhost:5500/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log("Error while liking post: ", error);
    }
  };
  return (
    <div className="w-full bg-[#16181c] text-white rounded-md flex p-4 gap-4 min-h-[150px]">
      <div className="h-16 w-24">
        <img
          src={userpic}
          className=" rounded-[50%] object-cover"
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
                <div className="shadow-md shadow-slate-800 p-4 rounded-md flex flex-col gap-4 bg-[#16181c] absolute top-0 right-5">
                  <div className="flex items-center gap-2">
                    <FiEdit2 className="w-[13px]" />
                    <span className="font-semibold text-xs">Edit</span>
                  </div>
                  <div className="bg-[#565a5e] w-full h-[1px]"></div>
                  <div
                    className="flex items-center gap-2"
                    // onClick={handledelete}
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
        <div className="flex gap-4 text-[#565a5e]">
          <div className="flex items-center justify-center gap-2">
            <BiMessageRounded />
            <span>10</span>
          </div>
          <div>
            <div
              className="flex items-center justify-center gap-2 cursor-pointer hover:scale-110"
              onClick={handleLike}
            >
              <AiOutlineLike />
              {likes ? <span>{likes}</span> : <span>0</span>}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <PiShareFatLight />
              <span>6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PostComponent.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  post: PropTypes.string,
  likes: PropTypes.number,
  postid: PropTypes.number,
  postuserid: PropTypes.number,
};

export default PostComponent;
