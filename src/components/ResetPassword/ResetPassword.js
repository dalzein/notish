import React, { useEffect, useState } from "react";
import { resetPassword } from "../../firebase/firebase-auth";
import ErrorLabel from "../ErrorLabel/ErrorLabel";
import "./ResetPassword.css";

function ResetPassword() {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [passwordResetError, setPasswordResetError] = useState("");
  const [pendingPasswordReset, setPendingPasswordReset] = useState(false);
  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);

  useEffect(() => {
    if (
      passwordResetEmail !== "" &&
      !passwordResetEmail.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ) {
      setPasswordResetError("Email address format must be valid");
    } else {
      setPasswordResetError("");
    }
  }, [passwordResetEmail]);

  function handleChange(e) {
    setPasswordResetEmail(e.target.value);
  }

  function handleResetPasswordSubmit(e) {
    e.preventDefault();

    if (passwordResetEmail === "") {
      setPasswordResetError("Cannot be empty");
      return;
    }

    setPendingPasswordReset(true);

    resetPassword(passwordResetEmail)
      .then(() => {
        setPasswordResetEmailSent(true);
        setPendingPasswordReset(false);
      })
      .catch((error) => {
        if (error === "auth/user-not-found") {
          setPasswordResetError("No user was found with that email address");
        } else {
          console.error(error);
          setPasswordResetError("An unexpected error has occured");
        }
        setPendingPasswordReset(false);
      });
  }

  return (
    <div>
      <div className="form-flex">
        <button
          className="reset-password"
          onClick={() =>
            setShowPasswordReset((previousValue) => !previousValue)
          }
        >
          Forgot password?
        </button>
      </div>
      {showPasswordReset && (
        <form
          className="reset-password-form"
          onSubmit={handleResetPasswordSubmit}
        >
          <input
            name="resetPasswordEmail"
            type="text"
            placeholder="Email"
            value={passwordResetEmail}
            onChange={handleChange}
            className="reset-password-email"
            autoComplete="off"
          ></input>
          <ErrorLabel error={passwordResetError} />
          <button
            type="submit"
            className="reset-password-button"
            disabled={passwordResetEmailSent || pendingPasswordReset}
          >
            {pendingPasswordReset && (
              <i className="fa-solid fa-rotate fa-spin"></i>
            )}
            {passwordResetEmailSent && !pendingPasswordReset && "Sent!"}
            {!pendingPasswordReset &&
              !passwordResetEmailSent &&
              "Send password reset email"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
