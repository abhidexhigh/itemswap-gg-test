import dynamic from "next/dynamic";

import React from "react";
import ReactApexChart from "react-apexcharts";

const ZoneGraph = ({ activeZone, seriesData }) => {
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
        "Master",
        "Diamond",
        "Platinum",
        "Gold",
        "Silver",
        "Bronze",
        "Iron",
      ],
      lines: {
        show: false, // Optionally hide the x-axis lines if desired
      },
      labels: {
        style: {
          colors: "white",
          fontSize: "16px",
        },
      },
    },
    yaxis: {
      title: {
        text: "% (Percentage of Players)",
        style: {
          color: "white",
          fontSize: "16px",
        },
      },
      labels: {
        style: {
          colors: "white",
          fontSize: "14px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#FFF"], // Setting the bars' color to white
    grid: {
      show: false, // Hides the grid lines (including horizontal lines)
    },
    tooltip: {
      theme: "dark",
      style: {
        backgroundColor: "#000",
        color: "#fff",
        fontSize: "16px",
      },
      y: {
        formatter: function (val) {
          return "" + val + "%";
        },
      },
    },
  });

  // const [options, setOptions] = React.useState({
  //   chart: {
  //     type: "bar",
  //     height: 350,
  //     toolbar: {
  //       show: false, // Hides the toolbar, including the export menu
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       columnWidth: "55%",
  //       endingShape: "rounded",
  //     },
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   stroke: {
  //     show: true,
  //     width: 2,
  //     colors: ["transparent"],
  //   },
  //   xaxis: {
  //     categories: [
  //       "Master",
  //       "Diamond",
  //       "Platinum",
  //       "Gold",
  //       "Silver",
  //       "Bronze",
  //       "Iron",
  //     ],
  //     lines: {
  //       show: false, // Optionally hide the x-axis lines if desired
  //     },
  //     labels: {
  //       style: {
  //         colors: "white",
  //         fontSize: "16px",
  //       },
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: "% (Percentage of Players)",
  //       style: {
  //         color: "white",
  //         fontSize: "16px",
  //       },
  //     },
  //     labels: {
  //       style: {
  //         colors: "white",
  //         fontSize: "14px",
  //       },
  //     },
  //   },
  //   fill: {
  //     opacity: 1,
  //   },
  //   colors: ["#FFF"], // Setting the bars' color to white
  //   grid: {
  //     show: false, // Hides the grid lines (including horizontal lines)
  //   },
  //   tooltip: {
  //     theme: "dark",
  //     style: {
  //       backgroundColor: "#000",
  //       color: "#fff",
  //       fontSize: "16px",
  //     },
  //     y: {
  //       formatter: function (val) {
  //         return "" + val + "%";
  //       },
  //     },
  //   },
  // });

  const [series, setSeries] = React.useState([
    {
      name: "Players",
      // Generate random numbers for the graph
      data: seriesData,
    },
  ]);

  return (
    <div className="bg-glass">
      <div
        className="zone-graph"
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(2px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "auto",
          padding: "20px",
        }}
      >
        <h3>Stats</h3>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ZoneGraph;
