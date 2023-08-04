import { useEffect, useState, useContext } from "react";
import { ClipLoader } from "react-spinners";
import PostComponent from "./PostComponent";
import { PostContext } from "../context/PostContext";

const RenderPostsComponent = () => {
  const [postData, setPostData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isPosted, setIsPosted } = useContext(PostContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://pulse-post.onrender.com/getposts");
        const data = await res.json();
        setPostData(data);
        setIsPosted(0);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [isPosted, setIsPosted]);

  return (
    <>
      {isLoading ? (
        <ClipLoader color="#ffffff" loading={isLoading} size={50} />
      ) : postData.length > 0 ? (
        postData.map((post) => (
          <PostComponent
            username={post.username}
            name={post.name}
            post={post.post}
            likes={post.likes}
            key={post.postid}
            postid={post.postid}
            postuserid={post.postuserid}
            mediaPath={post.media_path}
          />
        ))
      ) : (
        <div className="text-[#fff]">No Posts Found</div>
      )}
    </>
  );
};

export default RenderPostsComponent;
