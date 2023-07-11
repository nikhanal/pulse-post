import { useNavigate } from "react-router-dom";
import SignUpComponent from "../components/SignUpComponent";
import { useEffect } from "react";

const SignUpPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/");
    }
  });
  return (
    <div className="h-[100vh] flex items-center justify-center bg-black">
      <SignUpComponent />
    </div>
  );
};

export default SignUpPage;
