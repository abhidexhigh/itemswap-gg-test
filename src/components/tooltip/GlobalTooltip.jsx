export default function GlobalTooltip({ title, desc, subDesc, children }) {
  return (
    <div className="group relative flex max-w-max flex-col items-center justify-center !z-[999]">
      {children}
      <div className="absolute left-1/2 -top-20 ml-auto mr-auto min-w-max -translate-x-1/2 scale-0 transform rounded-lg px-3 py-2 text-xs md:text-base md:font-light font-medium transition-all duration-500 group-hover:scale-100 !z-[999]">
        <div className="flex max-w-xs md:text-base md:font-light flex-col items-center shadow-lg bg-gray-800 !z-[999]">
          <div className="rounded px-2 py-1 text-xs md:text-base md:font-light text-left text-yellow-300">
            {title}
          </div>
          {desc && (
            <div className="rounded px-2 py-1 text-xs md:text-base md:font-light text-left text-white">
              {desc}
            </div>
          )}
          {subDesc && (
            <div className="rounded px-2 py-1 text-xs md:text-base md:font-light text-left text-white">
              {subDesc}
            </div>
          )}
          {/* <div className="clip-bottom h-2 w-4 bg-gray-800"></div> */}
        </div>
      </div>
    </div>
  );
}
