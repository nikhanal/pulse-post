import { useRef, useState, useEffect, useContext } from "react";
import { PostContext } from "../context/PostContext";
import userPhoto from "../assets/profile_pic.jpeg";
import { MdPermMedia } from "react-icons/md";
import { AiOutlineGif } from "react-icons/ai";

const AddPostComponent = () => {
  const { setIsPosted } = useContext(PostContext);
  const [userId, setUserId] = useState("");
  const postRef = useRef();
  const mediaRef = useRef();
  const [userPic, setUserPic] = useState(userPhoto);
  const [uploadedMedia, setUploadedMedia] = useState("");

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
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      setUserId(localStorage.getItem("userid"));
    }
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    const postContent = postRef.current.value;
    const media = mediaRef.current.files[0];
    const formData = new FormData();
    formData.append("post", postContent);
    formData.append("userid", userId);
    formData.append("media", media);
    console.log(formData);
    try {
      const res = await fetch("http://localhost:5500/post", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log(await res.text());
        postRef.current.value = "";
        mediaRef.current.value = null;
        setUploadedMedia("");
        setIsPosted(1);
      } else {
        console.log(await res.text());
      }
    } catch (error) {
      console.log("Error while posting: ", error);
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
    <div className="text-white border-b-2  border-[#565a5e] flex p-4 gap-4">
      <div className="bg-red h-14 w-20">
        <img src={userPic} alt="User" className="rounded-[50%] object-cover" />
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
            className="bg-[#565a5e] px-6 py-2 rounded-xl hover:bg-black border border-[#565a5e]"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
        {uploadedMedia && (
          <p className="text-[#565a5e] mt-2">Uploaded Media: {uploadedMedia}</p>
        )}
      </div>
    </div>
  );
};

export default AddPostComponent;
