const ZoneTabs = ({ zones, activeZone, setActiveZone }) => {
  return (
    <ul className="flex flex-wrap pl-0 mb-0 list-none !border !border-white">
      {zones?.map((zone, index) => (
        <li
          key={index}
          className={`flex-auto flex-grow-1 text-center !border !border-white rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
            zone === activeZone ? "!bg-[#ca9372]" : ""
          }`}
          onClick={() => setActiveZone(zone)}
        >
          <a className="h-[50px] p-0 leading-[50px]">{zone}</a>
        </li>
      ))}
    </ul>
  );
};

export default ZoneTabs;
