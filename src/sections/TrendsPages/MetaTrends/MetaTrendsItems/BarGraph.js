import React, { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// PERFORMANCE OPTIMIZATION: Memoize static data to prevent recreation
const chartData = [
  { avg: 8 },
  { avg: 7 },
  { avg: 6 },
  { avg: 5 },
  { avg: 4 },
  { avg: 3 },
  { avg: 2 },
  { avg: 1 },
];

// PERFORMANCE OPTIMIZATION: Memoize tooltip styles to prevent recreation
const tooltipStyles = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  padding: "10px",
  paddingTop: "2px",
  paddingBottom: "2px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
};

// PERFORMANCE OPTIMIZATION: Memoized custom tooltip component
const CustomTooltip = memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyles}>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ margin: 0, color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

// PERFORMANCE OPTIMIZATION: Memoized chart margins to prevent recreation
const chartMargins = { top: 0, right: 0, left: 0, bottom: 0 };

// PERFORMANCE OPTIMIZATION: Memoized bar radius to prevent recreation
const barRadius = [8, 8, 0, 0];

// PERFORMANCE OPTIMIZATION: Heavily memoized BarChart component
const MyBarChartComponent = memo(({ height, width }) => {
  // PERFORMANCE OPTIMIZATION: Memoize container styles to prevent recreation
  const containerStyle = useMemo(
    () => ({
      width: `${width}%`,
      height: `${height}%`,
      margin: 0,
      padding: 0,
    }),
    [width, height]
  );

  return (
    <div className="mx-auto" style={containerStyle}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={chartMargins}>
          {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}
          {/* Hiding the axes */}
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avg" fill="#8884d8" radius={barRadius} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

// PERFORMANCE OPTIMIZATION: Set display name for better debugging
MyBarChartComponent.displayName = "MyBarChartComponent";

export default MyBarChartComponent;
