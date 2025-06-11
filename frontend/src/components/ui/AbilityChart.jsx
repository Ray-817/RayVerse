import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";

const data = [
  { subject: "Learning Ability", score: 4.9, fullMark: 5 },
  { subject: "Execution", score: 3.8, fullMark: 5 },
  { subject: "Problem Solving", score: 4.5, fullMark: 5 },
  { subject: "Communication & Collaboration", score: 4.5, fullMark: 5 },
  { subject: "Creativity", score: 4.5, fullMark: 5 },
  { subject: "Production Experience", score: 3, fullMark: 5 },
];

function CustomizedTick(props) {
  const { x, y, payload, fontSize } = props;
  const words = payload.value.split(" ");

  return (
    <text x={x} y={y} textAnchor="middle" fill="#343a40" fontSize={fontSize}>
      {words.map((word, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <tspan key={index} x={x} dy={index === 0 ? 0 : 18}>
          {word}
        </tspan>
      ))}
    </text>
  );
}

function AbilityChart() {
  // initialize the fontsize
  const [currentFontSize, setCurrentFontSize] = useState(12);

  //
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setCurrentFontSize(20);
      } else if (window.innerWidth >= 768) {
        // md breakpoint
        setCurrentFontSize(16);
      } else {
        // default for smaller screens
        setCurrentFontSize(12);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid stroke="#dddddd" />
        <PolarAngleAxis
          dataKey="subject"
          tick={<CustomizedTick fontSize={currentFontSize} />}
        />
        <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={5} />
        <Radar
          name="My Transferable Skill"
          dataKey="score"
          stroke="none"
          fill="#ffd43b"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default AbilityChart;
