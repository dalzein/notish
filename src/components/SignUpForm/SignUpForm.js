import React, { useEffect, useState } from "react";
import { signUpUser } from "../../firebase/firebase-auth";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import "./SignUpForm.css";

function SignUpForm() {
  const [{ name, email, password, confirmPassword }, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    other: "",
  });
  const [pendingSignUp, setPendingSignUp] = useState(false);

  // Validate name string
  useEffect(() => {
    if (name !== "" && !name.match(/^[A-Za-z]+$/)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        name: "Name can only contain letters",
      }));
    } else {
      setErrors((currentErrors) => ({
        ...currentErrors,
        name: "",
        other: "",
      }));
    }
  }, [name]);

  // Validate email string
  useEffect(() => {
    if (email !== "" && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: "Email address format must be valid",
      }));
    } else {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: "",
        other: "",
      }));
    }
  }, [email]);

  // Validate password string
  useEffect(() => {
    if (
      password !== "" &&
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,15}$/
      )
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        password:
          "Password must be 6-15 characters long and contain at least one number, symbol and uppercase letter",
      }));
    } else {
      setErrors((currentErrors) => ({
        ...currentErrors,
        password: "",
        other: "",
      }));
    }
  }, [password]);

  // Validate confirm password string
  useEffect(() => {
    if (confirmPassword !== "") {
      if (password !== confirmPassword) {
        setErrors((currentFormData) => ({
          ...currentFormData,
          confirmPassword: "Passwords don't match",
        }));
      } else {
        setErrors((currentFormData) => ({
          ...currentFormData,
          confirmPassword: "",
          other: "",
        }));
      }
    }
  }, [password, confirmPassword]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "name" && value.length > 15) return;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  function getEmptyFields() {
    const emptyFieldErrors = {};
    const errorMessage = "Cannot be empty";

    if (name === "") {
      emptyFieldErrors.name = errorMessage;
    }

    if (email === "") {
      emptyFieldErrors.email = errorMessage;
    }

    if (password === "") {
      emptyFieldErrors.password = errorMessage;
    }

    if (confirmPassword === "") {
      emptyFieldErrors.confirmPassword = errorMessage;
    }

    return emptyFieldErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Check if there are any empty fields
    const emptyFieldErrors = getEmptyFields();

    if (Object.keys(emptyFieldErrors).length > 0) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        ...emptyFieldErrors,
      }));
      return;
    }

    // Check if there are any unresolved errors
    const errorKeys = Object.keys(errors);
    for (let i = 0; i < errorKeys.length; i++) {
      if (errors[errorKeys[i]]) return;
    }

    setPendingSignUp(true);

    signUpUser(name, email, password)
      .then(() => {
        setPendingSignUp(false);
      })
      .catch((error) => {
        if (error === "auth/email-already-in-use") {
          setErrors((previousValue) => ({
            ...previousValue,
            email: "Email already in use",
          }));
        } else {
          console.error(error);
          setErrors((previousValue) => ({
            ...previousValue,
            other: "An unexpected error has occured",
          }));
        }
        setPendingSignUp(false);
      });
  }

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <p className="register-text">Create an account</p>
      <input
        name="name"
        value={name}
        type="text"
        maxLength="20"
        placeholder="Name"
        onChange={handleChange}
        autoComplete="off"
      />
      <ErrorLabel error={errors.name} />

      <input
        name="email"
        value={email}
        type="text"
        placeholder="Email"
        onChange={handleChange}
        autoComplete="off"
      />
      <ErrorLabel error={errors.email} />

      <input
        name="password"
        value={password}
        type="password"
        placeholder="Password"
        onChange={handleChange}
        autoComplete="off"
      />
      <ErrorLabel error={errors.password} />

      <input
        type="password"
        value={confirmPassword}
        name="confirmPassword"
        placeholder="Confirm password"
        onChange={handleChange}
        autoComplete="off"
      />
      <ErrorLabel error={errors.confirmPassword} />

      <button type="submit" disabled={pendingSignUp}>
        Sign up
      </button>
      <ErrorLabel error={errors.other} />
    </form>
  );
}

export default SignUpForm;
