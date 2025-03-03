import { useTranslation } from "react-i18next";
import "../../../i18n";
import Link from "next/link";
import compsData from "../../ApiStructure/Comps/Comps.json";

const Set10Tabs = ({ tabs, activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const others = t("others");
  const {
    props: {
      pageProps: {
        dehydratedState: { queries: data },
      },
    },
  } = compsData;
  const {
    state: {
      data: { champions },
    },
  } = data?.find((item) => item?.queryKey.includes("championRefs"));

  // Function to get a random champion's key
  function getRandomChampionKey() {
    const randomIndex = Math.floor(Math.random() * champions.length);
    return champions[randomIndex].key;
  }

  return (
    <ul className="flex flex-wrap pl-0 mb-4 list-none bg-[#222231]">
      {tabs?.map((tab, index) => (
        <Link
          key={index}
          href={
            tab === "Champions"
              ? `/${tab.toLowerCase()}/${getRandomChampionKey()}`
              : `/${tab.toLowerCase()}`
          }
          className={`flex-auto flex-grow-1 p-2 text-center !border-r !border-[#ffffff14] rounded-none font-bold -mb-[1px] text-[18px] cursor-pointer px-[12px] md:p-0 ${
            tab === activeTab
              ? "active text-gray-900 !bg-gray-100 border-r"
              : ""
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {/* <a className="h-[50px] p-0 leading-[50px]">{tab}</a> */}
          <li className="h-[50px] p-0 leading-[50px]">
            {tab && others?.[tab.toLowerCase()]}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Set10Tabs;
