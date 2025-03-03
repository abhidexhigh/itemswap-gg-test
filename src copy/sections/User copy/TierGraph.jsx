import React from "react";
import ReactApexChart from "react-apexcharts";

const TierGraph = () => {
  const seriesData = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 100)
  );

  const [options, setOptions] = React.useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false, // Hides the toolbar, including the export menu
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Chanlanger",
        "Grandmaster",
        "Master",
        "Diamond I",
        "Diamond II",
        "Diamond III",
        "Diamond IV",
        "Emerald I",
        "Emerald II",
        "Emerald III",
        "Emerald IV",
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
        show: false, // Optionally hide the x-axis lines if desired
      },
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: false, // Hides the grid lines (including horizontal lines)
    },
    tooltip: {
      theme: "dark",
      style: {
        backgroundColor: "#000",
        color: "#fff",
      },
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  });

  const [series, setSeries] = React.useState([
    {
      name: "Net Profit",
      // Generate random numbers for the graph
      data: seriesData,
    },
  ]);
  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

export default TierGraph;
