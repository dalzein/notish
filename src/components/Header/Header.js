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
        <h1>
          <span>Notish</span>
          <span className={styles.description}>
            Interactive note-taking app
          </span>
        </h1>
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
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                className={styles.check}
              >
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
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
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className={styles.gIcon}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
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
