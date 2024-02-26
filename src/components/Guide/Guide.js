import styles from "./Guide.module.css";

export default function Guide() {
  return (
    <div className={styles.guide}>
      <h2>Hello! Just a couple things...</h2>
      <p>
        Signing in isn't required to use this app. Your notes will be saved to
        your browser's local storage.
      </p>
      <p>
        If you decide to sign in, any notes you've created locally will be
        synced to your account.
      </p>
    </div>
  );
}
