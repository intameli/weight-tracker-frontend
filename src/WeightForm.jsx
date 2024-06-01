import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { v4 as uuidv4 } from "uuid";

export function WeightForm({
  settings,
  setSettings,
  weights,
  setWeights,
  inputRef,
}) {
  const [inputWeight, setInputWeight] = useState("");
  const { user } = useContext(UserContext);

  let inputStep = "any";
  let pattern = "";
  if (settings.forceDecimals) {
    if (settings.decimals === "0") {
      //for ios
      pattern = "\\d*";
      inputStep = "1";
    } else {
      inputStep = "0." + "0".repeat(settings.decimals - 1) + "1";
    }
  }

  async function handleSettings(object) {
    const nextSettings = { ...settings, ...object };
    setSettings(nextSettings);
    inputRef.current.focus();
    if (!user) {
      setSettings(nextSettings);
      localStorage.setItem("settings", JSON.stringify(nextSettings));
      return;
    }

    const url = import.meta.env.VITE_BACKEND_URL + "/api/settings/";
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(nextSettings),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      //setSettings(nextSettings);
      console.log(json);
    } else {
      console.log(json.error);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    inputRef.current.focus();
    if (!user) {
      const newDate = new Date();
      const nextWeights = [
        {
          value: inputWeight,
          units: settings.units,
          _id: uuidv4(),
          createdAt: newDate.toISOString(),
        },
        ...weights,
      ];
      setWeights(nextWeights);
      localStorage.setItem("weights", JSON.stringify(nextWeights));
      setInputWeight("");
      return;
    }
    const body = { value: inputWeight, units: settings.units };
    const url = import.meta.env.VITE_BACKEND_URL + "/api/weights/";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      setWeights([json, ...weights]);
      setInputWeight("");
    }
  }

  return (
    <form onSubmit={(e) => handleAdd(e)}>
      <fieldset>
        <legend>Settings</legend>
        <label>Force Decimals:</label>
        <input
          className="check"
          type="checkbox"
          checked={settings.forceDecimals}
          onChange={() =>
            handleSettings({ forceDecimals: !settings.forceDecimals })
          }
        />
        <select
          disabled={!settings.forceDecimals}
          value={settings.decimals}
          onChange={(e) => handleSettings({ decimals: e.target.value })}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <label>Show time stamp:</label>
        <input
          className="check"
          type="checkbox"
          checked={settings.showTime}
          onChange={() => handleSettings({ showTime: !settings.showTime })}
        />
        <label>Units:</label>
        <select
          value={settings.units}
          onChange={(e) => handleSettings({ units: e.target.value })}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
          <option value="st">st</option>
        </select>
      </fieldset>
      <input
        type="number"
        pattern={pattern}
        min="0"
        step={inputStep}
        autoFocus
        required
        ref={inputRef}
        value={inputWeight}
        onChange={(e) => {
          if (e.target.value.length < 9) {
            setInputWeight(e.target.value);
          }
        }}
      />
      <button className="addButton btn" type="submit">
        Log
      </button>
    </form>
  );
}
