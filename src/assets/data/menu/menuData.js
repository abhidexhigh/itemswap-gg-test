import compsData from "../../../ApiStructure/Comps/Comps.json";

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

const menuData = [
  // {
  //   id: "1W6WV",
  //   title: "Home",
  //   url: "#",
  //   subMenus: [
  //     {
  //       id: "TU4X2",
  //       title: "Home 1",
  //       url: "/",
  //     },
  //     {
  //       id: "WTY5W",
  //       title: "Home 2",
  //       url: "/home-two",
  //     },
  //     {
  //       id: "365V6",
  //       title: "Home 3",
  //       url: "/home-three",
  //     },
  //   ],
  // },
  // {
  //   id: "435U5",
  //   title: "Comps",
  //   url: "/comps",
  // },
  // {
  //   id: "2ZYYU",
  //   title: "SET",
  //   url: "#",
  //   subMenus: [
  //     {
  //       id: "0300T",
  //       title: "Champions",
  //       url: `/champions/${getRandomChampionKey()}`,
  //     },
  //     {
  //       id: "4XZ00",
  //       title: "Traits",
  //       url: "/traits",
  //     },
  //     {
  //       id: "43X1V",
  //       title: "Items",
  //       url: "/items",
  //     },
  //   ],
  // },
  {
    id: "435U5",
    title: "Trends",
    url: "#",
    subMenus: [
      {
        id: "U662W",
        title: "Meta Trends",
        url: "/metaTrends",
      },
      {
        id: "VT0WW",
        title: "Items Trends",
        url: "/itemsTrends",
      },
      {
        id: "Y43TW",
        title: "Champions Trends",
        url: "/championsTrends",
      },
      {
        id: "Y1Y2T",
        title: "Traits Trends",
        url: "/traitsTrends",
      },
      {
        id: "TTV2U",
        title: "Augments Trends",
        url: "/augmentsTrends",
      },
      {
        id: "T1Y3T",
        title: "Best Items Builds",
        url: "/bestItemsBuilds",
      },
    ],
  },
  {
    id: "435U6",
    title: "Leaderboard",
    url: "/leaderboard",
  },
  {
    id: "435U5",
    title: "Guides",
    url: "/guides/patchNotes",
  },
];

export default menuData;
