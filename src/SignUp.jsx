import { useState } from "react";
import { useSignUp } from "./useSignUp";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignUp();
  //add toggle for adding local storage to user
  //settings will just be added by default
  //ill need to add user ids to the objects

  async function handleSubmit(e) {
    e.preventDefault();
    await signup(username, password);
  }

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button className="btn loginBtn" disabled={isLoading}>
          Sign up
        </button>
      </form>
      <p className="login">
        Password must have atleast one capital leter and one number; Min
        password length is 6
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
