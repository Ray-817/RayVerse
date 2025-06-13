import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const data = [
    { subject: t("learning"), score: 4.9, fullMark: 5 },
    { subject: t("enthusiasm"), score: 4.7, fullMark: 5 },
    { subject: t("solving"), score: 4.5, fullMark: 5 },
    { subject: t("commu"), score: 4.5, fullMark: 5 },
    { subject: t("create"), score: 4.7, fullMark: 5 },
    { subject: t("experience"), score: 3.5, fullMark: 5 },
  ];
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
