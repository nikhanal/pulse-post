import userpic from "../assets/profile_pic.jpeg";
import { MdPermMedia } from "react-icons/md";
import { AiOutlineGif } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { PostContext } from "../context/PostContext";
import { useContext } from "react";

const AddPostComponent = () => {
  const { setIsPosted } = useContext(PostContext);
  const [userId, setuserId] = useState();
  const postref = useRef();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      setuserId(localStorage.getItem("userid"));
    }
  }, [userId]);

  const handlePost = async () => {
    const postContent = await postref.current.value;
    if (postContent.length > 0) {
      try {
        const res = await fetch("http://localhost:5500/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post: postContent,
            userid: userId,
          }),
        });
        if (res.ok) {
          console.log(await res.text());
          postref.current.value = "";
          setIsPosted(1);
        } else {
          console.log(await res.text());
        }
      } catch (error) {
        console.log("Error while posting: ", error);
      }
    }
  };
  return (
    <div className="text-white border-b-2  border-[#565a5e] flex p-4 gap-4">
      <div className="bg-red h-14 w-20">
        <img src={userpic} className="rounder-[50%] object-cover"></img>
      </div>
      <div className="w-full">
        <form>
          <input
            placeholder="What is in your mind?"
            className="bg-inherit py-10 w-full outline-0 text-lg"
            ref={postref}
          />
        </form>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-[#565a5e]">
            <MdPermMedia />
            <AiOutlineGif />
          </div>
          <button
            className=" bg-[#565a5e] px-6 py-2 rounded-xl hover:bg-black border border-[#565a5e]"
            onClick={(e) => {
              handlePost(e);
            }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPostComponent;
