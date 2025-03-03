import orderDesc from "@assets/image/icons/ico-order-desc.svg";
import icoRank1 from "@assets/image/icons/ico-rank-1.svg";
import questionMark from "@assets/image/icons/4368.png";
import orange from "@assets/image/icons/orange.png";
import icoChain from "@assets/image/icons/ico-chain.png";

const Set3_5 = () => {
  return (
    <div className="">
      <div className="min-h-[500px] overflow-x-auto">
        <table className="color-[#212529] table-fixed w-full">
          <thead className="bg-[#fff] border-x border-[#363944]">
            <tr className="border-t-0 table-row border-b border-[#888]">
              <th className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                Rank
              </th>
              <th className="hidden md:table-cell w-[30px] py-0 px-[0.25em] h-[60px] md:w-[70px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]"></th>
              <th className="py-0 px-[0.25em] h-[60px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                Name
              </th>
              <th className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[170px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                WinRate
              </th>
              <th className="w-[60px] py-0 px-[0.25em] h-[60px] md:w-[100px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                <div className="w-full h-full flex justify-center items-center">
                  <img src={orderDesc.src} className="mr-[5px]" />
                  Top4 %
                </div>
              </th>
              <th className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                Games
              </th>
              <th className="hidden md:table-cell w-[35px] py-0 px-[0.25em] h-[60px] md:w-[64px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                Wins
              </th>
              <th className="w-[30px] py-0 px-[0.25em] h-[60px] md:w-[80px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                Top4
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#fff] border-x border-[#363944]">
            {Array.from({ length: 10 }, (_, i) => (
              <tr className="border-t-0 table-row border-b border-[#888]">
                <td className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[80px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  <img src={icoRank1.src} className="my-0 mx-auto" />
                </td>
                <td className="hidden md:table-cell w-[30px] py-0 px-[0.25em] h-[60px] md:w-[70px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  -
                </td>
                <td className="py-0 px-[0.25em] h-[60px] bg-[#363944] text-white font-extralight whitespace-nowrap text-left text-[12px]">
                  <img
                    src={questionMark.src}
                    className="mr-[8px] w-[36px] h-[36px]  rounded-[50%] inline-block max-w-full"
                  />
                  <a href="#" className="inline-flex align-middle break-words">
                    <span>
                      RAMPAGEMODE
                      <span className="text-[#a5a8b4]">#NA1</span>
                    </span>
                    <img
                      src={icoChain.src}
                      className="ml-[4px] w-[12px] h-[12px]"
                    />
                  </a>
                </td>
                <td className="w-[40px] py-0 px-[0.25em] h-[60px] md:w-[170px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  24.8%
                </td>
                <td className="w-[60px] py-0 px-[0.25em] h-[60px] md:w-[100px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  <div className="w-full h-full flex justify-center items-center">
                    48.6%
                  </div>
                </td>
                <td className="hidden md:table-cell w-[40px] py-0 px-[0.25em] h-[60px] md:w-[60px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  214
                </td>
                <td className="hidden md:table-cell w-[35px] py-0 px-[0.25em] h-[60px] md:w-[64px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  53
                </td>
                <td className="w-[30px] py-0 px-[0.25em] h-[60px] md:w-[80px] bg-[#363944] text-white font-extralight whitespace-nowrap text-center text-[12px]">
                  104
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Set3_5;
