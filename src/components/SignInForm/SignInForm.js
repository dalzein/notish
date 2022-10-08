import React, { useState, useEffect } from "react";
import { signInUser, signInWithGoogle } from "../../firebase/firebase-auth";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import ResetPassword from "../ResetPassword/ResetPassword";
import "./SignInForm.css";

function SignInForm() {
  const [{ email, password }, setSignInFormData] = useState({
    email: "",
    password: "",
  });
  const [signInErrors, setSignInErrors] = useState({
    email: "",
    password: "",
    other: "",
  });
  const [pendingSignIn, setPendingSignIn] = useState(false);

  // Validate email string and clear current error state if valid
  useEffect(() => {
    if (email !== "" && !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setSignInErrors((currentErrors) => ({
        ...currentErrors,
        email: "Email address format must be valid",
      }));
    } else {
      setSignInErrors((currentErrors) => ({
        ...currentErrors,
        email: "",
        other: "",
      }));
    }
  }, [email]);

  // Clear current password error state
  useEffect(() => {
    setSignInErrors((currentErrors) => ({
      ...currentErrors,
      password: "",
      other: "",
    }));
  }, [password]);

  function handleChange(e) {
    const { name, value } = e.target;

    setSignInFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function getEmptyFields() {
    const emptyFieldErrors = {};
    const errorMessage = "Cannot be empty";

    if (email === "") {
      emptyFieldErrors.email = errorMessage;
    }

    if (password === "") {
      emptyFieldErrors.password = errorMessage;
    }

    return emptyFieldErrors;
  }

  function handleSignInSubmit(e) {
    e.preventDefault();

    // Check if there are any empty fields
    const emptyFieldErrors = getEmptyFields();

    if (Object.keys(emptyFieldErrors).length > 0) {
      setSignInErrors((currentErrors) => ({
        ...currentErrors,
        ...emptyFieldErrors,
      }));
      return;
    }

    // Check if there are any unresolved errors
    const errorKeys = Object.keys(signInErrors);
    for (let i = 0; i < errorKeys.length; i++) {
      if (signInErrors[errorKeys[i]]) {
        return;
      }
    }

    setPendingSignIn(true);

    signInUser(email, password)
      .then(() => {
        setPendingSignIn(false);
      })
      .catch((error) => {
        if (
          error === "auth/user-not-found" ||
          error === "auth/wrong-password"
        ) {
          setSignInErrors((previousValue) => ({
            ...previousValue,
            other: "Email or password is incorrect",
          }));
        } else {
          console.error(error);
          setSignInErrors((previousValue) => ({
            ...previousValue,
            other: "An unexpected error has occured",
          }));
        }

        setPendingSignIn(false);
      });
  }

  return (
    <div>
      <button className="google-sign-in-button" onClick={signInWithGoogle}>
        <i className="fa-brands fa-google"></i>
        Sign in with Google
      </button>
      <div className="form-flex">
        <div className="line"></div>
        <span>or</span>
        <div className="line"></div>
      </div>
      <div className="form-flex">
        <span>Sign in with an email and password</span>
      </div>
      <form onSubmit={handleSignInSubmit} className="sign-in-form">
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          autoComplete="off"
        />
        <ErrorLabel error={signInErrors.email} />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          autoComplete="off"
        />
        <ErrorLabel error={signInErrors.password} />

        <button type="submit" className="sign-in-form-button">
          {pendingSignIn ? (
            <i className="fa-solid fa-rotate fa-spin"></i>
          ) : (
            "Sign in"
          )}
        </button>
        <ErrorLabel error={signInErrors.other} />
      </form>
      <ResetPassword />
    </div>
  );
}

export default SignInForm;
