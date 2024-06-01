import { useEffect, useRef, useState } from "react";
import { Graph } from "./Graph.jsx";
import { WeightCards } from "./WeightCards.jsx";
import { WeightForm } from "./WeightForm.jsx";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

//should buttons have different cursor on hover?
//number incrementer built into input is useless, user should just type
//built in form validation is too limited, rewrite yourself
//works different with ios so ya rewrite
export default function App() {
  const { user } = useContext(UserContext);
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("settings"));
    return (
      saved || {
        forceDecimals: false,
        showTime: true,
        units: "kg",
        decimals: 1,
      }
    );
  });
  const [weights, setWeights] = useState(() => {
    //maybe add if to check for user, also in setting?
    //also add a fetch for settings, use promise.all
    if (user) return [];
    const saved = JSON.parse(localStorage.getItem("weights"));
    return saved || [];
  });
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchWeights() {
      const weightsUrl = import.meta.env.VITE_BACKEND_URL + "/api/weights/";
      const settingsUrl = import.meta.env.VITE_BACKEND_URL + "/api/settings/";
      const [weightsResponse, settingsResponse] = await Promise.all([
        fetch(weightsUrl, {
          headers: { "Authorization": `Bearer ${user.token}` },
        }),
        fetch(settingsUrl, {
          headers: { "Authorization": `Bearer ${user.token}` },
        }),
      ]);
      const [weightsJson, settingsJson] = await Promise.all([
        weightsResponse.json(),
        settingsResponse.json(),
      ]);
      if (weightsResponse.ok) {
        setWeights(weightsJson);
      }
      if (settingsResponse.ok) {
        console.log(settingsJson);
        setSettings(settingsJson);
      }
    }
    if (user) {
      fetchWeights();
    }
  }, [user]);

  return (
    <div className="container">
      <div className="topSection">
        <WeightForm
          settings={settings}
          setSettings={setSettings}
          weights={weights}
          setWeights={setWeights}
          inputRef={inputRef}
        />
      </div>
      <div className="bottomSection">
        <WeightCards
          settings={settings}
          weights={weights}
          setWeights={setWeights}
          inputRef={inputRef}
        />
        <Graph settings={settings} weights={weights} />
      </div>
    </div>
  );
}
