import "./Guide.css";

function Guide() {
  return (
    <div className="guide">
      <h2>Welcome!</h2>
      <p>
        Signing in isn't required to use this app - your notes will be saved to
        your browser's local storage
      </p>
      <p>
        If you decide to sign in, any notes you've created locally will be
        synced to your account
      </p>
    </div>
  );
}

export default Guide;
