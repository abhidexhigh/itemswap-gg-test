import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { avg: 8 },
  { avg: 7 },
  { avg: 6 },
  { avg: 5 },
  { avg: 4 },
  { avg: 3 },
  { avg: 2 },
  { avg: 1 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          paddingTop: "2px",
          paddingBottom: "2px",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p> */}
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ margin: 0, color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MyBarChartComponent = ({ height, width }) => {
  return (
    <div
      className="mx-auto"
      style={{
        width: `${width}%`,
        height: `${height}%`,
        margin: 0,
        padding: 0,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          {/* <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /> */}
          {/* Hiding the axes */}
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avg" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyBarChartComponent;
