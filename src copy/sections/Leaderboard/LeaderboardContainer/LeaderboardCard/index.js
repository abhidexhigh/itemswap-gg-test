import ico from "src/assets/image/icons/ico.png";
import challenger from "src/assets/image/icons/challenger.png";
import arrowUp from "src/assets/image/icons/arrow-up.svg";

const LeaderboardCard = ({ user, rank }) => {
  return (
    <div className="flex flex-row justify-start items-center bg-[#191919] mt-[8px] min-h-[110px] py-[26px] px-[30px]">
      <div
        className="flex flex-col md:flex-row items-center shrink-0"
        style={{ backdropFilter: "50px" }}
      >
        <div className="text-[20px] m-0 flex items-center">
          <img
            src={ico.src}
            className="mr-[10px] max-h-[50px] allign-middle border-none"
            alt="Icon"
          />
          <div className="flex flex-col justify-center items-start leading-[1.2] text-[24px]">
            <div className="text-[#fff]">
              <strong className="text-[#ca9372]">ItemSwap </strong>
              Leaderboards
            </div>
            <div className="text-[14px] font-extralight text-gray-400 mt-[5px]">
              Last Updated: 16h ago
            </div>
          </div>
        </div>
        <div className="ml-0 md:ml-[15px] mt-[10px] md:mt-0">
          <div className="border-r-0 bg-glass rounded-[4px] inline-flex">
            <div className="flex items-center text-[12px] py-[8px] px-[12px] border-r border-zinc-500">
              <img
                src={challenger.src}
                className="h-[48px] w-[48px]"
                alt="Challanger"
              />
              <span className="text-[#fff] text-[14px] ml-2">
                864 LP &nbsp;
              </span>
              <img src={arrowUp.src} className="ml-[4px]" alt="Arrow Up" />
            </div>
            <div className="flex items-center text-[12px] py-[8px] px-[12px]">
              <img
                src={challenger.src}
                className="h-[48px] w-[48px]"
                alt="Challanger"
              />
              <span className="text-[#fff] text-[14px] ml-2">
                864 LP &nbsp;
              </span>
              <img src={arrowUp.src} className="ml-[4px]" alt="Arrow Up" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
