import { useEffect } from "react";
import AddPostComponent from "../components/AddPostComponent";
import { SideBarComponent } from "../components/SideBarComponent";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RenderPostsComponent from "../components/RenderPostsComponent";
import { PostContext_Provider } from "../context/PostContext";

const HomePage = () => {
  const navigate = useNavigate();
  console.log(localStorage);
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
    }
  });

  return (
    <PostContext_Provider>
      <div className="bg-black">
        <SideBarComponent image={<AiOutlineUser />} />
        <div className="bg-black w-[60%] mx-auto pt-10 flex flex-col gap-10">
          <AddPostComponent />
          <RenderPostsComponent />
        </div>
      </div>
    </PostContext_Provider>
  );
};

export default HomePage;
