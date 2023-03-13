import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { signOutUser } from "../../firebase/firebase-auth";
import Guide from "../Guide/Guide";
import Modal from "../Modal/Modal";
import SignIn from "../SignIn/SignIn";
import "./Header.css";

function Header(props) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(
    window.localStorage.getItem("dismissGuide") ? false : true
  );

  if (props.userId && showSignInModal) {
    setShowSignInModal(false);
  }

  function handleGuideDismiss() {
    setShowGuideModal(false);
    window.localStorage.setItem("dismissGuide", true);
  }

  return (
    <header>
      <div className="header-left">
        <img src="/android-chrome-192x192.png" alt="logo" draggable="false" />
      </div>
      <div className="header-right">
        {props.userId && (
          <div className="auth-info">
            <span className="fa-stack syncing">
              <i className="fa-solid fa-cloud fa-stack-1x fa-xl"></i>
              {props.isSyncing ? (
                <i className="fa-solid fa-rotate fa-spin fa-stack-1x fa-sm"></i>
              ) : (
                <i className="fa-solid fa-check fa-stack-1x fa-sm"></i>
              )}
            </span>
            <span className="greeting">
              {auth.currentUser.displayName.split(" ")[0]}
            </span>
            <button
              type="button"
              className="header-button sign-out"
              onClick={signOutUser}
            >
              Sign out
            </button>
          </div>
        )}
        {!props.userId && !props.awaitingAuthRedirectResult && (
          <button
            type="button"
            className="header-button sign-in"
            onClick={() => setShowSignInModal(true)}
          >
            Sign in
          </button>
        )}
        {props.awaitingAuthRedirectResult && (
          <div className="auth-redirect-spinner">
            <i className="fa-solid fa-rotate fa-spin fa-xl"></i>
          </div>
        )}
        {!props.userId && (
          <Modal
            show={showSignInModal}
            onClose={() => setShowSignInModal(false)}
          >
            <SignIn />
          </Modal>
        )}
        <Modal
          show={showGuideModal}
          onClose={handleGuideDismiss}
          maxWidth="30rem"
        >
          <Guide />
        </Modal>
      </div>
    </header>
  );
}

export default Header;
