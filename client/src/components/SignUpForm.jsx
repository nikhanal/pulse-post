import { useState } from "react";
import PropTypes from "prop-types";
import tw from "tailwind-styled-components";

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

const ErrorMessage = ({ showError, message }) => {
  return showError && <span className="text-red-500 text-xs">{message}</span>;
};

const SignUpForm = ({ onSubmit }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formIsValid = validateForm();
    if (formIsValid) {
      onSubmit(formData);
    }
  };

  return (
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
  );
};

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
ErrorMessage.propTypes = {
  showError: PropTypes.bool,
  message: PropTypes.string,
};
export default SignUpForm;
