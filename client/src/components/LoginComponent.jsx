import tw from "tailwind-styled-components";
import Logo from "../assets/logos/PulsePost-logos_white.png";
import { Link } from "react-router-dom";
const InputSec = tw.input`
  w-full
  outline-none
  bg-inherit
  border
  border-[#565a5e]
  rounded-[10px]
  px-4
  py-2
  text-lg


`;

const LoginComponent = () => {
  return (
    <div className="w-[50%] py-8 bg-[#16181c] rounded-2xl text-white">
      <div className=" flex flex-col  w-[60%] m-auto gap-10">
        <div className="flex flex-col gap-4 items-center justify-center border-b-[#565a5e]">
          <img src={Logo} className="w-16 h-16" />
          <h1 className="text-3xl font-bold text-center">
            Log In To Pulse Post
          </h1>
        </div>
        <div className="bg-[#565a5e] w-full h-[1px]"></div>
        <form className="flex flex-col gap-4">
          <InputSec placeholder="Email" type="email"></InputSec>

          <InputSec placeholder="Password" type="password"></InputSec>
          <button
            className="  w-full
            outline-none
            bg-white
            text-[#565a5e]
            border-0
            rounded-[10px]
            px-4
            py-2
            text-lg 
          hover:bg-[#16181c] hover:border hover:border-[#565a5e]"
          >
            Log In
          </button>
        </form>
        <div className="flex justify-center gap-1">
          Don&apos;t have an account?
          <Link to="/signup" className="text-[#565a5e] underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
