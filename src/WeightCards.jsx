import { formatWeight, formatDate } from "./util.jsx";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

export function WeightCards({ settings, weights, setWeights, inputRef }) {
  const { user } = useContext(UserContext);
  async function handleRemove(removeId) {
    inputRef.current.focus();
    if (!user) {
      const nextWeights = weights.filter((w) => w._id !== removeId);
      setWeights(nextWeights);
      localStorage.setItem("weights", JSON.stringify(nextWeights));
      return;
    }
    const url = import.meta.env.VITE_BACKEND_URL + "/api/weights/" + removeId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      setWeights(weights.filter((w) => w._id !== json._id));
    }
  }

  return (
    <div>
      {weights.length == 0 ? (
        <div className="filler">Weights will appear here once entered</div>
      ) : (
        weights.map((w) => {
          return (
            <div key={w._id} className="divWrapper">
              <div className="weightDiv">
                <p className="bold">
                  {formatWeight(w, settings) + " " + settings.units}
                </p>
                <p>{formatDate(w.createdAt, settings.showTime)}</p>
              </div>
              <button
                className="remove btn"
                onClick={() => handleRemove(w._id)}
              >
                Remove
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
