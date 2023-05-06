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
            {props.isSyncing ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="spinner"
              >
                <path
                  opacity="0.2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="currentColor"
                />
                <path
                  d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                  fill="currentColor"
                />
              </svg>
            )}
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="spinner"
          >
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="currentColor"
            />
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
      {!props.userId && (
        <Modal show={showSignInModal} onClose={() => setShowSignInModal(false)}>
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
    </header>
  );
}

export default Header;
