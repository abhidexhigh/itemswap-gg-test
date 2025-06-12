import React, { memo, useMemo, useState } from "react";

// PERFORMANCE OPTIMIZATION: Static data for CSS bar chart (same as original)
const chartData = [
  { avg: 8, label: "8th" },
  { avg: 7, label: "7th" },
  { avg: 6, label: "6th" },
  { avg: 5, label: "5th" },
  { avg: 4, label: "4th" },
  { avg: 3, label: "3rd" },
  { avg: 2, label: "2nd" },
  { avg: 1, label: "1st" },
];

// PERFORMANCE OPTIMIZATION: CSS-based bar chart component (instant rendering, no delays)
const MyBarChartComponent = memo(({ height = 80, width = 100 }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);

  // PERFORMANCE OPTIMIZATION: Memoize container styles
  const containerStyle = useMemo(
    () => ({
      width: `${width}%`,
      height: `${height}%`,
      margin: 0,
      padding: 0,
    }),
    [width, height]
  );

  const handleBarHover = (data, event) => {
    setHoveredBar(data.avg);
    setTooltipData({
      value: data.avg,
      label: data.label,
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    });
  };

  const handleBarLeave = () => {
    setHoveredBar(null);
    setTooltipData(null);
  };

  return (
    <div className="css-bar-chart !mx-auto" style={containerStyle}>
      <div className="bar-chart-container">
        {chartData.map((data, index) => {
          const barHeight = (data.avg / 8) * 100; // Normalize to percentage
          const isHovered = hoveredBar === data.avg;

          return (
            <div
              key={data.avg}
              className="bar-wrapper"
              onMouseEnter={(e) => handleBarHover(data, e)}
              onMouseLeave={handleBarLeave}
            >
              <div
                className={`bar ${isHovered ? "hovered" : ""}`}
                style={{
                  height: `${barHeight}%`,
                  animationDelay: "0ms",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Custom CSS Tooltip */}
      {tooltipData && (
        <div
          className="chart-tooltip"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y - 30}px`,
          }}
        >
          Rank: {tooltipData.value}
        </div>
      )}

      <style jsx>{`
        .css-bar-chart {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .bar-chart-container {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          height: 100%;
          width: 100%;
          gap: 2px;
          padding: 4px;
        }

        .bar-wrapper {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: flex-end;
          cursor: pointer;
          position: relative;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #8884d8 0%, #6366f1 100%);
          border-radius: 2px 2px 0 0;
          transition: all 0.2s ease;
          animation: barGrow 0.3s ease-out forwards;
          transform-origin: bottom;
          min-height: 2px;
        }

        .bar:hover,
        .bar.hovered {
          background: linear-gradient(180deg, #a5a8ff 0%, #7c7fff 100%);
          transform: scaleY(1.05);
          box-shadow: 0 2px 8px rgba(136, 132, 216, 0.3);
        }

        @keyframes barGrow {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .chart-tooltip {
          position: absolute;
          background: #fff;
          border: 1px solid #ccc;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          pointer-events: none;
          z-index: 1000;
          white-space: nowrap;
        }

        .chart-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #fff;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .bar-chart-container {
            gap: 1px;
            padding: 2px;
          }

          .bar {
            border-radius: 1px 1px 0 0;
          }

          .chart-tooltip {
            font-size: 10px;
            padding: 2px 6px;
          }
        }
      `}</style>
    </div>
  );
});

// PERFORMANCE OPTIMIZATION: Set display name for better debugging
MyBarChartComponent.displayName = "MyBarChartComponent";

export default MyBarChartComponent;
