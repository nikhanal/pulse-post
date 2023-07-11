import { useEffect } from "react";
import AddPostComponent from "../components/AddPostComponent";

import PostComponent from "../components/PostComponent";
import { SideBarComponent } from "../components/SideBarComponent";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
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
    <div className="bg-black">
      <SideBarComponent image={<AiOutlineUser />} />
      <div className="bg-black w-[60%] mx-auto pt-10 flex flex-col gap-10">
        <AddPostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
        <PostComponent />
      </div>
    </div>
  );
};

export default HomePage;
