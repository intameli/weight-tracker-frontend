import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export function useSignUp() {
  const [error, setError] = useState(null);
  const [isloading, setIsLoading] = useState(null);
  const { setUser } = useContext(UserContext);

  async function signup(username, password) {
    setIsLoading(true);
    setError(null);

    const url = import.meta.env.VITE_BACKEND_URL + "/api/user/signup/";
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

    const settingsUrl = import.meta.env.VITE_BACKEND_URL + "/api/settings/";
    const settings = JSON.parse(localStorage.getItem("settings")) || {
      forceDecimals: false,
      showTime: true,
      units: "kg",
      decimals: 1,
    };
    console.log(settings);
    const settingsResponse = await fetch(settingsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${json.token}`,
      },
      body: JSON.stringify(settings),
    });
    const settingsJson = await settingsResponse.json();
    if (settingsResponse.ok) {
      console.log(settingsJson);
    } else {
      console.log(settingsJson.error);
    }

    setIsLoading(false);
  }
  return { signup, isloading, error };
}
