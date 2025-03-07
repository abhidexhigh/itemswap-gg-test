import orderDesc from "@assets/image/icons/ico-order-desc.svg";
import icoRank1 from "@assets/image/icons/ico-rank-1.svg";
import questionMark from "@assets/image/icons/4368.png";
import challenger from "@assets/image/icons/challenger.png";
import Emblems from "../../../../../data/emblems.json";

const LeaderboardItemsAll = ({ leaderboardData }) => {
  return (
    <div
      className=""
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(2px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderTop: "0",
        overflow: "auto",
      }}
    >
      <div className="min-h-[500px] overflow-x-auto">
        <table className="color-[#212529] table-fixed w-full">
          <thead className="border-x border-[#36394420]">
            <tr className="border-t-0 table-row border-b border-[#88888850]">
              <th className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                Rank
              </th>
              <th className="hidden md:table-cell w-[30px] py-0 px-[0.25em] h-[60px] md:w-[70px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]"></th>
              <th className="py-0 px-[0.25em] h-[60px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                Name
              </th>
              <th className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[160px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                Tier
              </th>
              <th className="w-[70px] py-0 px-[0.25em] h-[60px] md:w-[120px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                <div className="w-full h-full flex justify-center items-center">
                  <img src={orderDesc.src} className="mr-[5px]" />
                  LP
                </div>
              </th>
              <th className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[120px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                WinRate
              </th>
              <th className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[120px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                TOP4%
              </th>
              <th className="hidden md:table-cell w-[35px] py-0 px-[0.25em] h-[60px] md:w-[120px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                Games
              </th>
              <th className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                Wins
              </th>
              <th className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-bold whitespace-nowrap text-center text-[20px]">
                TOP4
              </th>
            </tr>
          </thead>
          <tbody className="border-x border-[#36394420]">
            {leaderboardData?.map((data) => (
              <tr className="border-t-0 table-row border-b border-[#88888850]">
                <td className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-extralight whitespace-nowrap text-center text-[12px]">
                  {data?.position < 4 ? (
                    <img
                      src={
                        data?.position === 1
                          ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-1_ebtyst.svg"
                          : data?.position === 2
                            ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-2_g1ozje.svg"
                            : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-3_wgyren.svg"
                      }
                      className="my-0 mx-auto w-[40px]"
                    />
                  ) : (
                    <span className="text-[16px]">{data?.position}</span>
                  )}
                </td>
                <td className="hidden md:table-cell w-[30px] py-0 px-[0.25em] h-[60px] md:w-[70px] text-[#fff] font-extralight whitespace-nowrap text-center text-[12px]">
                  -
                </td>
                <td className="py-0 px-[0.25em] h-[60px] text-[#fff] font-extralight whitespace-nowrap text-left text-[12px]">
                  <img
                    src={data?.profileIconUrl}
                    className="mr-[8px] w-[36px] h-[36px]  rounded-[50%] inline-block max-w-full"
                  />
                  <a
                    href="#"
                    className="inline-flex align-middle break-words text-[20px]"
                  >
                    {data?.gameName}
                  </a>
                </td>
                <td className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[170px] text-[#fff] font-extralight whitespace-nowrap text-[12px] text-left">
                  {console.log(
                    Emblems?.find(
                      (emblem) =>
                        emblem?.tier?.toLowerCase() === data?.tier.toLowerCase()
                    )
                  )}
                  <img
                    src={
                      Emblems?.find(
                        (emblem) =>
                          emblem?.tier?.toLowerCase() ===
                          data?.tier.toLowerCase()
                      )?.imageUrl
                    }
                    className="w-[40px] h-[40px] sticky md:inline"
                  />
                  <span className="font-light hidden md:inline text-[20px] ml-2">
                    {data?.tier}
                  </span>
                  <span className="font-light block md:hidden">C</span>
                </td>
                <td className="w-[60px] py-0 px-[0.25em] h-[60px] md:w-[100px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  <div className="w-full h-full flex justify-center items-center">
                    {data?.summonerLevel} LP
                  </div>
                </td>
                <td className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  {((data?.wins * 100) / data?.plays).toFixed(2)}%
                </td>
                <td className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[60px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  {((data?.tops * 100) / data?.plays).toFixed(2)}%
                </td>
                <td className="hidden md:table-cell w-[35px] py-0 px-[0.25em] h-[60px] md:w-[64px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  {data?.plays}
                </td>
                <td className="w-[30px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  {data?.wins}
                </td>
                <td className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] text-[#fff] font-extralight whitespace-nowrap text-center text-[20px]">
                  {data?.tops}
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
