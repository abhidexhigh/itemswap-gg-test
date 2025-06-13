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
        top: 3,
        left: 1,
        blur: 4,
        opacity: 0.1,
        color: "#6936ff",
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
      fontFamily: "'CeraPro', sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "85%",
        endingShape: "rounded",
        borderRadius: 2,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -15,
      style: {
        fontSize: "8px",
        colors: ["rgba(255, 255, 255, 0.8)"],
        fontWeight: "500",
        textShadow: "0px 0px 4px rgba(0,0,0,0.8)",
      },
      background: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["rgba(105, 54, 255, 0.3)"],
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
        show: false,
        style: {
          colors: Array(28).fill("rgba(255, 255, 255, 0.7)"),
          fontSize: "8px",
          fontWeight: 400,
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
          color: "#6936ff",
          width: 1,
          dashArray: 2,
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
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "10px",
          fontWeight: 400,
        },
        offsetX: -5,
      },
      labels: {
        style: {
          colors: "rgba(255, 255, 255, 0.7)",
          fontSize: "9px",
          fontWeight: 400,
        },
        formatter: function (val) {
          return val.toFixed(0) + "%";
        },
      },
      min: 0,
      max: Math.max(...expandedSeriesData) * 1.2,
      tickAmount: 4,
      forceNiceScale: true,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.95,
        stops: [0, 85, 100],
      },
    },
    colors: generateTierColors(),
    grid: {
      borderColor: "rgba(255, 255, 255, 0.08)",
      strokeDashArray: 2,
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
        fontFamily: "'CeraPro', sans-serif",
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
          value: 0.1,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
          value: 0.2,
        },
      },
    },
  });

  // Generate colors for each tier - matching theme colors
  function generateTierColors() {
    const colors = [];
    // Master - Purple/Violet (matching theme accent)
    colors.push("#8b5cf6", "#8b5cf6", "#8b5cf6", "#8b5cf6");
    // Diamond - Blue
    colors.push("#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6");
    // Platinum - Cyan
    colors.push("#06b6d4", "#06b6d4", "#06b6d4", "#06b6d4");
    // Gold - Amber
    colors.push("#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b");
    // Silver - Gray
    colors.push("#9ca3af", "#9ca3af", "#9ca3af", "#9ca3af");
    // Bronze - Orange/Brown
    colors.push("#ea580c", "#ea580c", "#ea580c", "#ea580c");
    // Iron - Dark Gray
    colors.push("#6b7280", "#6b7280", "#6b7280", "#6b7280");

    return colors;
  }

  const [series, setSeries] = React.useState([
    {
      name: "Players",
      data: expandedSeriesData,
    },
  ]);

  // Group labels for the chart - updated colors to match theme
  const tierLabels = [
    { tier: "Master", color: "#8b5cf6" },
    { tier: "Diamond", color: "#3b82f6" },
    { tier: "Platinum", color: "#06b6d4" },
    { tier: "Gold", color: "#f59e0b" },
    { tier: "Silver", color: "#9ca3af" },
    { tier: "Bronze", color: "#ea580c" },
    { tier: "Iron", color: "#6b7280" },
  ];

  return (
    <div className="bg-glass rounded-lg overflow-hidden">
      <div
        className="zone-graph"
        style={{
          background: "rgba(30, 31, 53, 0.8)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(105, 54, 255, 0.3)",
          borderRadius: "8px",
          overflow: "hidden",
          padding: "16px",
        }}
      >
        <h3 className="text-base font-semibold mb-3 text-white">
          {others?.playerDistribution}
        </h3>

        {/* Tier labels */}
        <div className="flex justify-between mb-2 px-1">
          {tierLabels.map((label, index) => (
            <div key={index} className="text-center">
              <span
                className="text-[9px] font-medium"
                style={{ color: label.color }}
              >
                {label.tier}
              </span>
            </div>
          ))}
        </div>

        <div id="chart" className="mt-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={220}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2 text-center">
          <p className="text-[10px] md:text-sm mb-0 opacity-70">
            {others?.playerRankDistributionStats}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZoneGraph;
