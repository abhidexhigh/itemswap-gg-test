import { useTranslation } from "react-i18next";
import "../../../i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TrendsNav = ({ selected }) => {
  const { t } = useTranslation();
  const others = t("others");
  const router = useRouter();
  const handleChange = (e) => {
    router.push(`/${e.target.value}`);
  };

  return (
    <>
      <div className="lg:hidden mx-2">
        <select
          id="tabs"
          className="!bg-[#27282f] 1text-[#fff] border border-gray-300 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[75px] text-[19px]"
          onChange={handleChange}
        >
          <option
            value="metaTrends"
            selected={selected === "metaTrends" ? "selected" : null}
          >
            Meta Trends
          </option>
          <option
            value="recentDecks"
            selected={selected === "recentDecks" ? "selected" : null}
          >
            Recent #1 Decks
          </option>
          <option
            value="championsTrends"
            selected={selected === "championsTrends" ? "selected" : null}
          >
            Champions Trends
          </option>
          <option
            value="itemsTrends"
            selected={selected === "itemsTrends" ? "selected" : null}
          >
            Items Trends
          </option>
          <option
            value="traitsTrends"
            selected={selected === "traitsTrends" ? "selected" : null}
          >
            Traits Trends
          </option>
          <option
            value="augmentsTrends"
            selected={selected === "augmentsTrends" ? "selected" : null}
          >
            Augments Trends
          </option>
          <option
            value="bestItemsBuilds"
            selected={selected === "bestItemsBuilds" ? "selected" : null}
          >
            Best Items Buils
          </option>
          <option>France</option>
          <option>Germany</option>
        </select>
      </div>
      <div className="bg-[#222231] rounded-lg !border !border-[#ffffff70]">
        <ul className="hidden text-md font-medium text-center text-gray-500 shadow lg:flex">
          <li className="w-full text-nowrap">
            <Link
              href="/metaTrends"
              className={`${
                selected === "metaTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-l-lg"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.metaTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/recentDecks"
              className={`${
                selected === "recentDecks"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.recentDecks}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/championsTrends"
              className={`${
                selected === "championsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.championsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/itemsTrends"
              className={`${
                selected === "itemsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.itemsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/traitsTrends"
              className={`${
                selected === "traitsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.traitsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/augmentsTrends"
              className={`${
                selected === "augmentsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others.augmentsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/bestItemsBuilds"
              className={`${
                selected === "bestItemsBuilds"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-r-lg"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.bestItemsBuilds}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TrendsNav;
