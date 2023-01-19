import React, { useState } from "react";
import SignInForm from "../SignInForm/SignInForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import "./SignIn.css";

function SignIn() {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div>
      <div className="modal-tabs">
        <button
          className={activeTab === "signin" ? "active" : ""}
          onClick={() => setActiveTab("signin")}
        >
          Sign in
        </button>
        <button
          className={activeTab === "signout" ? "active" : ""}
          onClick={() => setActiveTab("signout")}
        >
          Sign up
        </button>
      </div>

      <div className="modal-form">
        {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
}

export default SignIn;
