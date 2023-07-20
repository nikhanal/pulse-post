import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import { PostContext } from "../context/PostContext";
import { useContext } from "react";

const RenderPostsComponent = () => {
  const [postData, setPostData] = useState([]);
  const { isPosted, setIsPosted } = useContext(PostContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://pulse-post.onrender.com/getposts");
        const data = await res.json();
        setPostData(data);
        setIsPosted(0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [isPosted, setIsPosted]);

  return (
    <>
      {postData.length > 0 ? (
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
