import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import { PostContext } from "../context/PostContext";
import { useContext } from "react";
const RenderPostsComponent = () => {
  const [postData, setPostData] = useState([]);
  const { isPosted, setIsPosted } = useContext(PostContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:5500/getposts");
      const data = await res.json();
      setPostData(data);
      setIsPosted(0);
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
            key={post.postid}
          />
        ))
      ) : (
        <div className="text-[#fff]">No Posts Found</div>
      )}
    </>
  );
};

export default RenderPostsComponent;
