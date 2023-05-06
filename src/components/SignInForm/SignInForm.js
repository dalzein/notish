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
    if (email !== "" && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
            fill="currentColor"
          />
        </svg>{" "}
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

        <button
          type="submit"
          className="sign-in-form-button"
          disabled={pendingSignIn}
        >
          Sign in
        </button>
        <ErrorLabel error={signInErrors.other} />
      </form>
      <ResetPassword />
    </div>
  );
}

export default SignInForm;
