import { Link, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import Logo from "../assets/logos/PulsePost-logos_white.png";
import SignUpForm from "./SignUpForm";
import { useState } from "react";
import { PropTypes } from "prop-types";

const Container = tw.div`
  w-[50%]
  py-8
  bg-[#16181c]
  rounded-2xl
  text-white
`;

const InnerContainer = tw.div`
  flex flex-col
  w-[60%]
  m-auto
  gap-6
`;

const Border = tw.div`
  bg-[#565a5e]
  w-full
  h-[1px]
`;

const SignUpComponent = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const addUserToDb = async (formData) => {
    try {
      const response = await fetch("https://pulse-post.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        const { token, username, name, userid } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);
        localStorage.setItem("userid", userid);
        console.log("Sign Up successful");
        navigate("/");
      } else {
        const err = await response.text();
        console.log(err);
        setErrorMsg(err);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <Container>
      <InnerContainer>
        <div className="flex flex-col gap-4 items-center justify-center border-b-[#565a5e]">
          <img src={Logo} className="w-16 h-16" alt="Pulse Post Logo" />
          <h1 className="text-2xl font-bold text-center">
            Sign Up To Pulse Post
          </h1>
        </div>
        <Border />
        <SignUpForm onSubmit={addUserToDb} />
        {errorMsg && <span className="text-red-500 text-xs">{errorMsg}</span>}
        <div className="flex justify-center gap-1">
          Already have an account?
          <Link to="/login" className="text-[#565a5e] underline">
            Log In
          </Link>
        </div>
      </InnerContainer>
    </Container>
  );
};

SignUpComponent.propTypes = {
  message: PropTypes.string,
};

export default SignUpComponent;
