import { formatWeight, formatDate } from "./util.jsx";
import { Fragment } from "react";
import { useState } from "react";

export function Graph({ settings, weights }) {
  //show time at bottom?
  const [showInfo, setShowInfo] = useState(null);

  const boxWidth = 160;
  const width = 600;
  const height = 600;
  const marginVert = 80;
  const marginHori = 20;
  let prevX = -100;
  let prevX2 = -100;
  let minValue, maxValue, step, start, end;
  let newWeights = JSON.parse(JSON.stringify(weights));

  switch (settings.units) {
    case "kg":
      step = 5;
      minValue = 75;
      maxValue = 85;
      break;
    case "lb":
      step = 10;
      minValue = 140;
      maxValue = 160;
      break;
    case "st":
      step = 1;
      minValue = 11;
      maxValue = 13;
      break;
  }

  newWeights.reverse();
  newWeights.forEach((w) => {
    w.value = formatWeight(w, settings);
  });
  if (newWeights.length) {
    start = Date.parse(newWeights[0].date);
    end = Date.parse(newWeights[newWeights.length - 1].date);
    const weightsArr = newWeights.map((w) => w.value);
    minValue = Math.min(...weightsArr);
    maxValue = Math.max(...weightsArr);
  }
  const bottomXGridLine = Math.floor(minValue / step) * step - step;
  const topXGridLine = Math.ceil(maxValue / step) * step + step;
  const xSteps = (topXGridLine - bottomXGridLine) / step;
  const xStepValue = height / xSteps;

  let points = "";
  newWeights.forEach((w) => {
    const date = Date.parse(w.date);
    w.x = ((date - start) / (end - start)) * width || 0;
    w.y =
      ((topXGridLine - w.value) / (topXGridLine - bottomXGridLine)) * height;
    points += `${w.x},${w.y} `;
  });

  let xGridLines = [];
  for (let x = 0; x < xSteps; x += 1) {
    xGridLines.push(
      <Fragment key={x}>
        <line
          x1="0"
          y1={x * xStepValue}
          x2={width}
          y2={x * xStepValue}
          stroke="grey"
          strokeWidth="2"
        />
        <text x={width - 50} y={x * xStepValue + 15}>
          {topXGridLine - step * x}
        </text>
      </Fragment>
    );
  }

  return (
    <svg
      className="graph"
      viewBox={`0 0 ${width + marginHori * 2} ${height + marginVert * 2}`}
      width="40vw"
    >
      <g transform={`translate(${marginHori} ${marginVert})`}>
        {xGridLines.map((l) => l)}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={height}
          stroke="black"
          strokeWidth="10"
        />
        <line
          x1={width}
          y1={height}
          x2="0"
          y2={height}
          stroke="black"
          strokeWidth="10"
        />
        <polyline points={points} fill="none" stroke="red" />
        {newWeights.map((w) => {
          if (w.x < prevX + 10) return;
          else prevX = w.x;
          return (
            <circle
              key={w.id}
              onMouseEnter={() => setShowInfo(w.id)}
              onMouseLeave={() => setShowInfo(null)}
              className="point"
              style={{ transformOrigin: `${w.x}px ${w.y}px` }}
              //need to apply in style because of transformOrigin not
              //working in react
              stroke="transparent"
              strokeWidth="3"
              cx={w.x}
              cy={w.y}
              r="7"
              fill="red"
            />
          );
        })}
        {newWeights.map((w) => {
          if (w.x < prevX2 + 10) return;
          else prevX2 = w.x;
          let gOffset = 0;
          if (w.x < boxWidth / 2) {
            gOffset = boxWidth / 2 - w.x;
          } else if (w.x > width - boxWidth / 2) {
            gOffset = -boxWidth / 2 + (width - w.x);
          }
          return (
            <g
              style={
                showInfo === w.id
                  ? {
                      visibility: "visible",
                      opacity: 1,
                    }
                  : {}
              }
              key={w.id}
              className="info"
              transform={`translate(${w.x + gOffset} ${w.y})`}
            >
              <rect
                fill="grey"
                rx="30"
                ry="30"
                x="-80"
                y="-110"
                width={boxWidth}
                height="80"
              />
              <text x="0" y="-70" textAnchor="middle" fontSize="2rem">
                {w.value + " " + settings.units}
              </text>
              <text x="0" y="-45" textAnchor="middle" fontSize="1rem">
                {formatDate(w.date, settings.showTime)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
