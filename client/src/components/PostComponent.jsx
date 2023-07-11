import { useState, useRef } from "react";
import userpic from "../assets/profile_pic.jpeg";
import { AiOutlineLike, AiOutlineDelete } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import { BiMessageRounded } from "react-icons/bi";
import { FiEdit2 } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";

const PostComponent = () => {
  const dropDownRef = useRef();
  const [dropdown, setDropdown] = useState(false);

  window.addEventListener("click", (e) => {
    if (e.target !== dropDownRef.current?.childNodes[0]) {
      setDropdown(false);
    }
  });

  return (
    <div className="w-full bg-[#16181c] text-white rounded-md flex p-4 gap-4">
      <div className="h-16 w-24">
        <img
          src={userpic}
          className=" rounded-[50%] object-cover"
          alt="Profile"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <span className="font-semibold">Nishan Khanal</span>
            <span className="text-[#565a5e]">@theKhanal</span>
          </div>
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
              <div className="shadow-md shadow-slate-800 p-4 rounded-md flex flex-col gap-4 bg-[#16181c] absolute top-0 right-4">
                <div className="flex items-center gap-2">
                  <FiEdit2 className="w-[13px]" />
                  <span className="font-semibold text-xs">Edit</span>
                </div>
                <div className="bg-[#565a5e] w-full h-[1px]"></div>
                <div className="flex items-center gap-2">
                  <AiOutlineDelete className="w-[13px]" />
                  <span className="font-semibold text-xs">Delete</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          How are Nepali doctors able to afford the entire cost of USMLE exams,
          USCE and observerships? Not to sound offensive but is everyone rich in
          Nepal? 😶
        </div>
        <div className="flex gap-4 text-[#565a5e]">
          <div className="flex items-center justify-center gap-2 ">
            <BiMessageRounded />
            <span>10</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2">
              <AiOutlineLike />
              <span>2</span>
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

export default PostComponent;
