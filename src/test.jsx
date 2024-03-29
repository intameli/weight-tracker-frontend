import { useState } from "react";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("weights"));
    return saved || [];
  });
  const [input, setInput] = useState();
  return (
    <>
      <button
        onClick={() => {
          localStorage.clear();
        }}
      >
        Delete all local storage
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newWeight = [...count, input];
          setCount(newWeight);
          localStorage.setItem("weights", JSON.stringify(newWeight));
        }}
      >
        <input
          type="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" />
      </form>
      {count.map((w, i) => {
        const date = new Date();
        const dateString = date.toString();
        return (
          <div key={i} className="divWrapper">
            <div className="weightDiv">
              <h4>{count + " kg"}</h4>
              <h5>{formatDate(dateString)}</h5>
            </div>
            <button className="remove">Remove</button>
          </div>
        );
      })}
    </>
  );
}

function formatDate(date) {
  const dateObject = Date.parse(date);
  return new Intl.DateTimeFormat(undefined, {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(dateObject);
}
