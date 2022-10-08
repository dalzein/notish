import React, { useEffect, useState } from "react";
import "./Header.css";
import SignIn from "../SignIn/SignIn";
import { signOutUser } from "../../firebase/firebase-auth";
import { auth } from "../../firebase/firebase";
import Modal from "../Modal/Modal";
import Guide from "../Guide/Guide";

function Header(props) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(
    window.localStorage.getItem("dismissGuide") ? false : true
  );

  useEffect(() => {
    if (props.userId) {
      setShowSignInModal(false);
    }
  }, [props.userId]);

  function handleGuideDismiss() {
    setShowGuideModal(false);
    window.localStorage.setItem("dismissGuide", true);
  }

  return (
    <header>
      <nav>
        <div className="nav-left">
          <img src="/icon.svg" alt="icon" draggable="false" />
        </div>
        <div className="nav-right">
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
          <button
            className="guide-button"
            onClick={() => setShowGuideModal(true)}
          >
            <i className="fa-solid fa-question"></i>
          </button>
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
      </nav>
    </header>
  );
}

export default Header;
