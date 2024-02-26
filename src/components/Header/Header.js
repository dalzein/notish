import React, { useCallback, useState } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithGoogle, signOutUser } from "../../firebase/firebase-auth";
import Guide from "../Guide/Guide";
import Modal from "../Modal/Modal";
import styles from "./Header.module.css";

export default function Header({
  isSyncing,
  userId,
  awaitingAuthRedirectResult,
}) {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [guideModalIsOpen, setGuideModalIsOpen] = useState(
    window.localStorage.getItem("guideDismissed") ? false : true
  );

  if (userId && showSignInModal) {
    setShowSignInModal(false);
  }

  const handleGuideDismiss = useCallback(() => {
    setGuideModalIsOpen(false);
    window.localStorage.setItem("guideDismissed", true);
  }, []);

  return (
    <header>
      <div className={styles.headerLeft}>
        <img src="/android-chrome-192x192.png" alt="logo" draggable="false" />
      </div>
      <div className={styles.headerRight}>
        {userId && (
          <div className={styles.authInfo}>
            {isSyncing ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.spinner}
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
                className={styles.check}
              >
                <path
                  d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span className={styles.greeting}>
              {auth.currentUser.displayName.split(" ")[0]}
            </span>
            <button
              type="button"
              className={styles.signOutButton}
              onClick={signOutUser}
            >
              Sign out
            </button>
          </div>
        )}
        {!userId && !awaitingAuthRedirectResult && (
          <button className={styles.signInButton} onClick={signInWithGoogle}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.gIcon}
            >
              <path
                d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
                fill="currentColor"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        )}
        {awaitingAuthRedirectResult && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.spinner}
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
      <Modal isOpen={guideModalIsOpen} close={handleGuideDismiss}>
        <Guide />
      </Modal>
    </header>
  );
}
