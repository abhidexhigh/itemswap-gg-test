import ico from "src/assets/image/icons/ico.png";
import challenger from "src/assets/image/icons/challenger.png";
import arrowUp from "src/assets/image/icons/arrow-up.svg";

const LeaderboardCard = ({ user, rank }) => {
  return (
    <div className="bg-[#222231] rounded-t-lg border border-b-0 border-[#ffffff4d] p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center">
            <img
              src={ico.src}
              className="w-[40px] sm:w-[50px] h-auto mr-3"
              alt="Icon"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                <span className="text-[#ca9372]">ItemSwap</span> Leaderboards
              </h1>
              <p className="text-sm sm:text-base text-gray-400 mt-1">
                Last Updated: 16h ago
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <div className="bg-[#2a2a3a] rounded-lg p-3 flex items-center">
              <img
                src={challenger.src}
                className="w-[36px] h-[36px]"
                alt="Challenger"
              />
              <span className="text-white text-sm sm:text-base ml-2">
                864 LP
                <img
                  src={arrowUp.src}
                  className="inline-block ml-1 w-4 h-4"
                  alt="Up"
                />
              </span>
            </div>
            <div className="bg-[#2a2a3a] rounded-lg p-3 flex items-center">
              <img
                src={challenger.src}
                className="w-[36px] h-[36px]"
                alt="Challenger"
              />
              <span className="text-white text-sm sm:text-base ml-2">
                864 LP
                <img
                  src={arrowUp.src}
                  className="inline-block ml-1 w-4 h-4"
                  alt="Up"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full sm:w-[250px] h-[45px] bg-[#2a2a3a] text-white rounded-lg pl-4 pr-10 
                       border border-[#ffffff20] focus:border-[#ca9372] focus:outline-none 
                       transition-all duration-300 placeholder-gray-400"
              placeholder="Search player..."
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
