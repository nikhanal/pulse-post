import { useState } from "react";
import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";
import PropTypes from "prop-types";

import Logo from "../assets/logos/PulsePost-logos_white.png";

const InputSec = tw.input`
  w-full
  outline-none
  bg-inherit
  border
  border-[#565a5e]
  rounded-[10px]
  px-4
  py-1
  text-lg
`;

const SignUpComponent = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateInput = (value, pattern) => {
    return pattern.test(value);
  };

  const validateForm = () => {
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    const newErrors = {
      nameError: false,
      passwordError: false,
      emailError: false,
      usernameError: false,
      passwordConfirmationError: false,
    };

    if (!validateInput(formData.name, namePattern)) {
      newErrors.nameError = true;
    }

    if (!validateInput(formData.username, usernamePattern)) {
      newErrors.usernameError = true;
    }

    if (!validateInput(formData.email, emailPattern)) {
      newErrors.emailError = true;
    }

    if (!validateInput(formData.password, passwordPattern)) {
      newErrors.passwordError = true;
    }

    if (formData.password !== confirmPassword) {
      newErrors.passwordConfirmationError = true;
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const addUserToDb = async () => {
    try {
      const response = await fetch("http://localhost:5500/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
        }),
      });

      if (response.ok) {
        console.log("User registered successfully");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formIsValid = validateForm();
    if (formIsValid) {
      try {
        await addUserToDb();
      } catch (error) {
        console.error("Error occurred during registration:", error);
      }
    }
  };

  const ErrorMessage = ({ showError, message }) => {
    return showError && <span className="text-red-500 text-xs">{message}</span>;
  };

  return (
    <div className="w-[50%] py-8 bg-[#16181c] rounded-2xl text-white">
      <div className="flex flex-col w-[60%] m-auto gap-6">
        <div className="flex flex-col gap-4 items-center justify-center border-b-[#565a5e]">
          <img src={Logo} className="w-16 h-16" alt="Pulse Post Logo" />
          <h1 className="text-2xl font-bold text-center">
            Sign Up To Pulse Post
          </h1>
        </div>
        <div className="bg-[#565a5e] w-full h-[1px]"></div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <InputSec
            placeholder="Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
          <ErrorMessage
            showError={errors.nameError}
            message="Name can contain only letters and spaces characters."
          />

          <InputSec
            placeholder="Email"
            type="text"
            value={formData.email}
            required
            onChange={(e) => {
              setFormData({
                ...formData,
                email: e.target.value,
              });
            }}
          />
          <ErrorMessage
            showError={errors.emailError}
            message="Please enter a valid email."
          />

          <InputSec
            placeholder="Username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => {
              setFormData({
                ...formData,
                username: e.target.value,
              });
            }}
          />
          <ErrorMessage
            showError={errors.usernameError}
            message="Username can contain only letters, numbers, and spaces characters."
          />

          <InputSec
            placeholder="Password"
            type="password"
            required
            value={formData?.password}
            onChange={(e) => {
              setFormData({
                ...formData,
                password: e.target.value,
              });
            }}
          />
          <ErrorMessage
            showError={errors.passwordError}
            message="Please enter a password with one uppercase number and special character."
          />

          <InputSec
            placeholder="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <ErrorMessage
            showError={errors.passwordConfirmationError}
            message="Please match the password."
          />

          <button
            type="submit"
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
            Sign Up
          </button>
        </form>
        <div className="flex justify-center gap-1">
          Already have an account?
          <Link to="/login" className="text-[#565a5e] underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

SignUpComponent.propTypes = {
  showError: PropTypes.bool,
  message: PropTypes.string,
};

export default SignUpComponent;
