import "./Guide.css";

function Guide() {
  return (
    <div className="guide">
      <h1>Welcome to Notish!</h1>
      <div className="pre-text">
        <p>
          You don't need to sign up to use Notish - your notes will be saved to
          your browser's local storage
        </p>
        <p>
          If you decide to sign in, any notes you've created locally will be
          synced to your account
        </p>
      </div>
      <div className="visual-guide">
        <p>Create and edit notes</p>
        <img
          src={require("./edit-content.gif")}
          alt="Edit your notes"
          draggable="false"
        ></img>
        <p>Rearrange your notes</p>
        <img
          src={require("./drag.gif")}
          alt="Rearrange notes"
          draggable="false"
        ></img>
        <p>Colour your notes</p>
        <img
          src={require("./edit-colour.gif")}
          alt="Edit note colour"
          draggable="false"
        ></img>
        <p>Tag your notes</p>
        <img
          src={require("./edit-tag.gif")}
          alt="Edit note tag"
          draggable="false"
        ></img>
      </div>
    </div>
  );
}

export default Guide;
