import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";
import "../../../../i18n";
import ReactApexChart from "react-apexcharts";

const ZoneGraph = ({ activeZone, seriesData, handleBarClick }) => {
  const { t } = useTranslation();
  const others = t("others");
  // Generate more data points if needed
  const expandedSeriesData = React.useMemo(() => {
    // If we already have enough data points, use them
    if (seriesData.length >= 28) return seriesData;

    // Otherwise, generate more data points based on the existing ones
    const expanded = [];
    const tiers = [
      "Master",
      "Diamond",
      "Platinum",
      "Gold",
      "Silver",
      "Bronze",
      "Iron",
    ];
    const divisions = ["I", "II", "III", "IV"];

    let index = 0;
    tiers.forEach((tier) => {
      const baseValue = seriesData[index] || Math.floor(Math.random() * 100);
      index++;

      divisions.forEach((division) => {
        // Create some variation within the tier
        const variation = Math.random() * 0.3 - 0.15; // -15% to +15% variation
        expanded.push(Math.max(1, Math.round(baseValue * (1 + variation))));
      });
    });

    return expanded;
  }, [seriesData]);

  const [options, setOptions] = React.useState({
    chart: {
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 2,
        blur: 6,
        opacity: 0.2,
        color: "#6c5ce7",
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 600,
        animateGradually: {
          enabled: true,
          delay: 100,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 250,
        },
      },
      background: "transparent",
      fontFamily: "'Poppins', sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
        endingShape: "rounded",
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels for cleaner look with many bars
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -15,
      style: {
        fontSize: "8px",
        colors: ["#fff"],
        fontWeight: "bold",
        textShadow: "0px 0px 6px rgba(0,0,0,0.5)",
      },
      background: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Master I",
        "Master II",
        "Master III",
        "Master IV",
        "Diamond I",
        "Diamond II",
        "Diamond III",
        "Diamond IV",
        "Platinum I",
        "Platinum II",
        "Platinum III",
        "Platinum IV",
        "Gold I",
        "Gold II",
        "Gold III",
        "Gold IV",
        "Silver I",
        "Silver II",
        "Silver III",
        "Silver IV",
        "Bronze I",
        "Bronze II",
        "Bronze III",
        "Bronze IV",
        "Iron I",
        "Iron II",
        "Iron III",
        "Iron IV",
      ],
      lines: {
        show: false,
      },
      labels: {
        show: false, // Hide x-axis labels for cleaner look
        style: {
          colors: Array(28).fill("#ffffff"),
          fontSize: "8px",
          fontWeight: 500,
        },
        offsetY: 3,
        rotate: 90,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: "#6c5ce7",
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      title: {
        text: `% ${others?.ofPlayers}`,
        style: {
          color: "white",
          fontSize: "10px",
          fontWeight: 500,
        },
        offsetX: -5,
      },
      labels: {
        style: {
          colors: "white",
          fontSize: "9px",
        },
        formatter: function (val) {
          return val.toFixed(0) + "%";
        },
      },
      min: 0,
      max: Math.max(...expandedSeriesData) * 1.2, // Add some padding above the highest value
      tickAmount: 4,
      forceNiceScale: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 90, 100],
      },
    },
    colors: generateTierColors(),
    grid: {
      borderColor: "rgba(255,255,255,0.1)",
      strokeDashArray: 3,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 5,
      },
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "11px",
      },
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: function () {
            return "Players:";
          },
        },
        formatter: function (val) {
          return val + `% ${others?.ofPlayerBase}`;
        },
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: false,
        position: "topRight",
        offsetY: 0,
        offsetX: 0,
      },
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.15,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
          value: 0.35,
        },
      },
    },
  });

  // Generate colors for each tier
  function generateTierColors() {
    const colors = [];
    // Master - Pink/Purple
    colors.push("#ff9ff3", "#ff9ff3", "#ff9ff3", "#ff9ff3");
    // Diamond - Blue
    colors.push("#70a1ff", "#70a1ff", "#70a1ff", "#70a1ff");
    // Platinum - Green
    colors.push("#7bed9f", "#7bed9f", "#7bed9f", "#7bed9f");
    // Gold - Yellow/Orange
    colors.push("#ffa502", "#ffa502", "#ffa502", "#ffa502");
    // Silver - Light Grey
    colors.push("#ced6e0", "#ced6e0", "#ced6e0", "#ced6e0");
    // Bronze - Dark Grey
    colors.push("#a4b0be", "#a4b0be", "#a4b0be", "#a4b0be");
    // Iron - Darker Grey
    colors.push("#747d8c", "#747d8c", "#747d8c", "#747d8c");

    return colors;
  }

  const [series, setSeries] = React.useState([
    {
      name: "Players",
      data: expandedSeriesData,
    },
  ]);

  // Group labels for the chart
  const tierLabels = [
    { tier: "Master", color: "#ff9ff3" },
    { tier: "Diamond", color: "#70a1ff" },
    { tier: "Platinum", color: "#7bed9f" },
    { tier: "Gold", color: "#ffa502" },
    { tier: "Silver", color: "#ced6e0" },
    { tier: "Bronze", color: "#a4b0be" },
    { tier: "Iron", color: "#747d8c" },
  ];

  return (
    <div className="bg-glass rounded-lg overflow-hidden">
      <div
        className="zone-graph"
        style={{
          background: "#101010",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(123, 97, 255, 0.3)",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "16px",
        }}
      >
        <h3 className="text-base font-bold mb-2 text-white">
          {others?.playerDistribution}
        </h3>

        {/* Tier labels */}
        <div className="flex justify-between mb-1 px-2">
          {tierLabels.map((label, index) => (
            <div key={index} className="text-center">
              <span
                className="text-[9px] font-semibold"
                style={{ color: label.color }}
              >
                {label.tier}
              </span>
            </div>
          ))}
        </div>

        <div id="chart" className="mt-1">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={220}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 text-center">
          <p className="text-[10px] md:text-sm mb-0">
            {others?.playerRankDistributionStats}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZoneGraph;
