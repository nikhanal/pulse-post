import { useEffect } from "react";
import LoginComponent from "../components/LoginComponent";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("token");
    if (isLoggedIn) {
      navigate("/");
    }
  });
  return (
    <div className="h-[100vh] flex items-center justify-center bg-black">
      <LoginComponent />
    </div>
  );
};

export default LoginPage;
