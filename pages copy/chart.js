import dynamic from "next/dynamic";

// const BarChart3D = dynamic(() => import("../src/components/BarChart3D"), {
//   ssr: false,
// });

const Home = () => {
  const data = [
    { label: "Category 1", value: 3 },
    { label: "Category 2", value: 7 },
    { label: "Category 3", value: 5 },
    { label: "Category 4", value: 9 },
    { label: "Category 5", value: 4 },
  ];

  return (
    <div>
      <h1>3D Bar Chart in Next.js</h1>
      {/* <BarChart3D data={data} /> */}
    </div>
  );
};

export default Home;
