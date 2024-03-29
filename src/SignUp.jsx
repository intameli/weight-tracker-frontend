import { useState } from "react";
import { useSignUp } from "./hooks/useSignUp";

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
    <form onSubmit={handleSubmit}>
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
      <button disabled={isLoading}>Sign up</button>
      {error && <p>{error}</p>}
    </form>
  );
}
