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
        show: false,
      },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        endingShape: "rounded",
        borderRadius: 4,
        distributed: false,
      },
    },
    colors: ["#8884d8", "#6b46c1", "#805ad5", "#9f7aea", "#b794f4"],
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
      labels: {
        style: {
          colors: Array(32).fill("#a0aec0"),
          fontSize: "10px",
          fontFamily: "Inter, sans-serif",
        },
        rotate: -45,
        hideOverlappingLabels: true,
      },
      lines: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "Players",
        style: {
          color: "#a0aec0",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      labels: {
        style: {
          colors: ["#a0aec0"],
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#4c1d95"],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.9,
      },
    },
    grid: {
      show: true,
      borderColor: "#2d3748",
      strokeDashArray: 5,
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
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: function (val) {
          return val + " players";
        },
      },
      marker: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -90,
              fontSize: "8px",
            },
          },
        },
      },
    ],
  });

  const [series, setSeries] = React.useState([
    {
      name: "Players",
      data: seriesData,
    },
  ]);

  return (
    <div className="bg-[#222231] rounded-xl p-4 shadow-lg border border-[#ffffff10]">
      <h3 className="text-lg font-semibold text-white mb-4">
        Rank Distribution
      </h3>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
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

export default TierGraph;
