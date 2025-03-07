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
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 5,
        opacity: 0.2,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        borderRadius: 5, // Added border radius to the bar's top section
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
        show: false,
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
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#a29bfe"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ["#8884d8"],
    grid: {
      borderColor: "#555",
      strokeDashArray: 4,
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

  const [series, setSeries] = React.useState([
    {
      name: "Players",
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
