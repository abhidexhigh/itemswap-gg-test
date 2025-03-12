import orderDesc from "@assets/image/icons/ico-order-desc.svg";
import icoRank1 from "@assets/image/icons/ico-rank-1.svg";
import questionMark from "@assets/image/icons/4368.png";
import challenger from "@assets/image/icons/challenger.png";
import Emblems from "../../../../../data/emblems.json";

const LeaderboardItemsAll = ({ leaderboardData }) => {
  return (
    <div className="bg-[#1a1b2b] rounded-b-lg border border-t-0 border-[#ffffff4d]">
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#2a2a3a] text-white">
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                Rank
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                Change
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                Player
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                Tier
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  <img
                    src={orderDesc.src}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    alt="Sort"
                  />
                  <span>Rating</span>
                </div>
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                Win Rate
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                Top 4
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                Games
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                Wins
              </th>
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                TOP4
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData?.map((data, index) => (
              <tr
                key={index}
                className="border-b border-[#ffffff1a] hover:bg-[#2a2a3a] transition-colors duration-200"
              >
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  {data?.position < 4 ? (
                    <img
                      src={
                        data?.position === 1
                          ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-1_ebtyst.svg"
                          : data?.position === 2
                            ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-2_g1ozje.svg"
                            : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-3_wgyren.svg"
                      }
                      className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
                      alt={`Rank ${data?.position}`}
                    />
                  ) : (
                    <span className="text-white text-sm sm:text-base">
                      {data?.position}
                    </span>
                  )}
                </td>
                <td className="py-4 px-2 text-center text-gray-400 whitespace-nowrap">
                  -
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={data?.profileIconUrl}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      alt={data?.gameName}
                    />
                    <a
                      href="#"
                      className="text-white hover:text-[#ca9372] transition-colors duration-200 text-sm sm:text-base"
                    >
                      {data?.gameName}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        Emblems?.find(
                          (emblem) =>
                            emblem?.tier?.toLowerCase() ===
                            data?.tier.toLowerCase()
                        )?.imageUrl
                      }
                      className="w-6 h-6 sm:w-8 sm:h-8"
                      alt={data?.tier}
                    />
                    <span className="text-white text-sm sm:text-base">
                      {data?.tier}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white font-medium text-sm sm:text-base">
                    {data?.summonerLevel} LP
                  </span>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white text-sm sm:text-base">
                    {((data?.wins * 100) / data?.plays).toFixed(1)}%
                  </span>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white text-sm sm:text-base">
                    {((data?.tops * 100) / data?.plays).toFixed(1)}%
                  </span>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white text-sm sm:text-base">
                    {data?.plays}
                  </span>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white text-sm sm:text-base">
                    {data?.wins}
                  </span>
                </td>
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  <span className="text-white text-sm sm:text-base">
                    {data?.tops}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardItemsAll;
