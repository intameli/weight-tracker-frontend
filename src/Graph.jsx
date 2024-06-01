import { formatWeight, formatDate } from "./util.jsx";
import { Fragment } from "react";
import { useState } from "react";

export function Graph({ settings, weights }) {
  //show time at bottom?
  //add information hover thing that tells you how many data points were ignored
  const [showInfo, setShowInfo] = useState(null);

  const boxWidth = 160;
  const width = 600;
  const height = 600;
  const marginVert = 65;
  const marginHori = 20;
  let prevX = width * 2;
  let removed = 0;
  let minValue, maxValue, step, start, end;
  const weightArr = weights.map((w) => formatWeight(w, settings));

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
  if (weightArr.length) {
    end = Date.parse(weights[0].createdAt);
    start = Date.parse(weights[weights.length - 1].createdAt);
    minValue = Math.min(...weightArr);
    maxValue = Math.max(...weightArr);
  }
  const bottomXGridLine = Math.floor(minValue / step) * step - step;
  const topXGridLine = Math.ceil(maxValue / step) * step + step;
  const xSteps = (topXGridLine - bottomXGridLine) / step;
  const xStepValue = height / xSteps;

  let points = "";
  let circles = [];
  let infoBoxes = [];
  weights.forEach((w, i) => {
    const date = Date.parse(w.createdAt);
    const x = ((date - start) / (end - start)) * width || 0;
    if (x > prevX - 4) {
      removed += 1;
      return;
    }
    prevX = x;
    const value = weightArr[i];
    const y =
      ((topXGridLine - value) / (topXGridLine - bottomXGridLine)) * height;
    points = `${x},${y} ` + points;
    circles.push(
      <circle
        key={w._id}
        onMouseEnter={() => setShowInfo(w._id)}
        onMouseLeave={() => setShowInfo(null)}
        className="point"
        style={{ transformOrigin: `${x}px ${y}px` }}
        //need to apply in style because of transformOrigin not
        //working in react
        stroke="transparent"
        strokeWidth="3"
        cx={x}
        cy={y}
        r="7"
        fill="red"
      />
    );
    let gOffset = 0;
    if (x < boxWidth / 2) {
      gOffset = boxWidth / 2 - x;
    } else if (x > width - boxWidth / 2) {
      gOffset = -boxWidth / 2 + (width - x);
    }
    infoBoxes.push(
      <g
        style={
          showInfo === w._id
            ? {
                visibility: "visible",
                opacity: 1,
              }
            : {}
        }
        key={w._id}
        className="info"
        transform={`translate(${x + gOffset} ${y})`}
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
          {value + " " + settings.units}
        </text>
        <text x="0" y="-45" textAnchor="middle" fontSize="1rem">
          {formatDate(w.createdAt, settings.showTime)}
        </text>
      </g>
    );
  });
  //push then reverse is faster than unshift
  circles.reverse();
  infoBoxes.reverse();

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
    <div className="graphContainer">
      <MoreInfo removed={removed} />
      <svg
        className="graph"
        viewBox={`0 0 ${width + marginHori * 2} ${height + marginVert * 2}`}
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
          {circles.map((c) => c)}
          {infoBoxes.map((b) => b)}
        </g>
      </svg>
    </div>
  );
}

function MoreInfo({ removed }) {
  //should only be rendered if removed in >0
  return (
    <div className="moreInfo" data-removed={removed}>
      i
    </div>
  );
}
