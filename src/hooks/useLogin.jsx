import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export function useLogin() {
  const [error, setError] = useState(null);
  const [isloading, setIsLoading] = useState(null);
  const { setUser } = useContext(UserContext);

  async function login(username, password) {
    setIsLoading(true);
    setError(null);

    const url = import.meta.env.VITE_BACKEND_URL + "/api/user/login/";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      setUser(json);
    } else {
      setError(json.error);
    }
    setIsLoading(false);
  }
  return { login, isloading, error };
}
