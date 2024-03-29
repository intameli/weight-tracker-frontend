import { useState } from "react";
import { useLogin } from "./hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  async function handleSubmit(e) {
    e.preventDefault();
    await login(username, password);
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
      <button disabled={isLoading}>Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}