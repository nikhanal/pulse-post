import tw from "tailwind-styled-components";
import Logo from "../assets/logos/PulsePost-logos_white.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

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
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginFormData.email,
          password: loginFormData.password,
        }),
      });

      setIsLoading(false);

      if (response.ok) {
        const data = await response.json();
        const { token, username, name, userid } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);
        localStorage.setItem("userid", userid);
        console.log("Login successful");
        navigate("/");
      } else if (response.status === 409) {
        const errorMessage = await response.text();
        console.error(errorMessage);
        setErrorMessage(errorMessage);
      } else if (response.status === 401) {
        console.error("Incorrect password");
        setErrorMessage("Incorrect password");
      } else {
        console.error("Login failed");
        setErrorMessage("Login failed");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorMessage("Error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[50%] py-8 bg-[#16181c] rounded-2xl text-white">
      <div className="flex flex-col w-[60%] m-auto gap-10">
        <div className="flex flex-col gap-4 items-center justify-center border-b-[#565a5e]">
          <img src={Logo} className="w-16 h-16" alt="Pulse Post Logo" />
          <h1 className="text-3xl font-bold text-center">
            Log In To Pulse Post
          </h1>
        </div>
        <div className="bg-[#565a5e] w-full h-[1px]"></div>
        {isLoading ? (
          <ClipLoader color="#ffffff" loading={isLoading} size={50} />
        ) : (
          <>
            <form className="flex flex-col gap-4">
              <InputSec
                placeholder="Email"
                type="email"
                onChange={(e) =>
                  setLoginFormData({ ...loginFormData, email: e.target.value })
                }
              />
              <InputSec
                placeholder="Password"
                type="password"
                onChange={(e) =>
                  setLoginFormData({
                    ...loginFormData,
                    password: e.target.value,
                  })
                }
              />
              <button
                onClick={handleLogin}
                className="w-full
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
              {errorMessage && (
                <span className="text-red-500 text-xs">{errorMessage}</span>
              )}
            </form>
            <div className="flex justify-center gap-1">
              Don&apos;t have an account?
              <Link to="/signup" className="text-[#565a5e] underline">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
