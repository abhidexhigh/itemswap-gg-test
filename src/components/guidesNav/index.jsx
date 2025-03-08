import Link from "next/link";
import { useRouter } from "next/navigation";

const GuidesNav = ({ selected }) => {
  const router = useRouter();
  console.log("selected", selected);
  const handleChange = (e) => {
    router.push(`/${e.target.value}`);
  };

  return (
    <>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        <li className="w-full">
          <Link
            href="/guides/patchNotes"
            className={`text-[22px] ${
              selected === "patchNotes"
                ? "active text-gray-100 !bg-gray-900 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-200 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
            aria-current="page"
          >
            Patch Notes
          </Link>
        </li>
        {/* <li className="w-full">
          <Link
            href="/metaTrends"
            className={`${
              selected === "metaTrends"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Meta Trends
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/championsTrends"
            className={`${
              selected === "championsTrends"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Champions Trends
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/itemsTrends"
            className={`${
              selected === "itemsTrends"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Item Trends
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/traitsTrends"
            className={`${
              selected === "traitsTrends"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Traits Trends
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/augmentsTrends"
            className={`${
              selected === "augmentsTrends"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Augments Trends
          </Link>
        </li>
        <li className="w-full">
          <Link
            href="/bestItemsBuilds"
            className={`${
              selected === "bestItemsBuilds"
                ? "active text-gray-900 !bg-gray-100 border-r"
                : null
            } inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
          >
            Best Items Builds
          </Link>
        </li> */}
      </ul>
    </>
  );
};

export default GuidesNav;
