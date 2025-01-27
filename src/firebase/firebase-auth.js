import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

export const signUpUser = (name, email, password) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>
      updateProfile(userCredential.user, { displayName: name }).then(
        () => userCredential.user.uid
      )
    )
    .catch((error) => {
      throw error.code;
    });

export const signOutUser = () =>
  signOut(auth)
    .then()
    .catch((error) => {
      throw error.code;
    });

export const resetPassword = (email) =>
  sendPasswordResetEmail(auth, email)
    .then()
    .catch((error) => {
      throw error.code;
    });

// Google OAuth sign in
export const signInWithGoogle = () => {
  // We'll set a flag in local storage so that when the browser is redirected back to the site the app knows to wait for the auth result (which takes a while for some reason)
  localStorage.setItem("redirected", "true");
  signInWithPopup(auth, provider);
};
