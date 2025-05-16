import { useRef, useState, useEffect, useContext } from "react";
import { PostContext } from "../context/PostContext";
import userPhoto from "../assets/profile_pic.jpeg";
import { MdPermMedia } from "react-icons/md";
import { AiOutlineGif } from "react-icons/ai";

const AddPostComponent = () => {
  const { setIsPosted, isPosted } = useContext(PostContext);
  const [userId, setUserId] = useState("");
  const postRef = useRef();
  const mediaRef = useRef();
  const [userPic, setUserPic] = useState(userPhoto);
  const [uploadedMedia, setUploadedMedia] = useState("");
  const [postEmpty, setPostEmpty] = useState(false);

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
  }, []);

  useEffect(() => {
    setPostEmpty(false);
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      setUserId(localStorage.getItem("userid"));
    }
  }, [isPosted]);

  const handlePost = async (e) => {
    e.preventDefault();
    const postContent = postRef.current.value;
    const media = mediaRef.current.files[0];
    const formData = new FormData();
    formData.append("userid", localStorage.getItem("userid"));
    formData.append("post", postContent);
    if (media) {
      formData.append("media", media);
    }
    if (postContent.length > 0 || media) {
      try {
        const res = await fetch("https://pulse-post.onrender.com/post", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          postRef.current.value = "";
          mediaRef.current.value = null;
          setUploadedMedia("");
          setIsPosted(1);
        }
      } catch (error) {
        console.log("Error while adding post: ", error);
      }
    } else {
      setPostEmpty(true);
    }
  };

  const handleMediaInputChange = () => {
    const file = mediaRef.current.files[0];
    if (file) {
      setUploadedMedia(file.name);
    } else {
      setUploadedMedia("");
    }
  };

  return (
    <>
      <div className="text-white border-b-2  border-[#565a5e] flex p-4 gap-4">
        <div className="bg-red h-14 w-20">
          <img
            src={userPic}
            alt="User"
            className="rounded-[50%] object-cover"
          />
        </div>
        <div className="w-full">
          <form>
            <input
              placeholder="What is in your mind?"
              className="bg-inherit py-8 w-full outline-0 text-lg"
              ref={postRef}
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              ref={mediaRef}
              style={{ display: "none" }}
              onChange={handleMediaInputChange}
            />
          </form>
          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-[#565a5e]">
              <label htmlFor="fileInput">
                <MdPermMedia className="cursor-pointer" />
              </label>
              <AiOutlineGif />
            </div>
            <button
              className="bg-[#1d9bf0] px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base rounded-full hover:bg-[#1a8cd8] transition-colors font-semibold"
              onClick={handlePost}
            >
              Post
            </button>
          </div>
          {uploadedMedia && (
            <p className="text-[#565a5e] mt-2">
              Uploaded Media: {uploadedMedia}
            </p>
          )}
          {postEmpty && (
            <div className="text-[#565a5e]">Please Enter Something to post</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddPostComponent;
