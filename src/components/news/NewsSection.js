import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const NewsSection = () => {
  const { t } = useTranslation();
  const LT = t("landing");

  const newsItems = [
    {
      id: 1,
      title: "Army Dragone Global Launch",
      date: "June 10, 2025",
      image:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1740733283/RPG_3_mfl20e.webm",
      imageType: "video",
      excerpt:
        "The wait is over! Army Dragone is now available worldwide on all platforms.",
      category: "Release",
    },
    {
      id: 2,
      title: "New Arena Tournament Season",
      date: "June 5, 2025",
      image:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1740733284/Arena_V1_s6cfdw.webm",
      imageType: "video",
      excerpt:
        "Join the Arena Tournament and compete for glory and exclusive rewards!",
      category: "Event",
    },
    {
      id: 3,
      title: "Upcoming Dragon Expansion",
      date: "May 25, 2025",
      image:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650877/ArmyDragone_text_copy_kelovj.png",
      imageType: "image",
      excerpt:
        "Prepare for the ultimate challenge with new dragons and epic battles coming next month.",
      category: "Update",
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="mx-auto">
        <div className="mb-12 text-center">
          <motion.h2
            className="mb-4 inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-3xl font-bold text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {LT.latestUpdates || "Latest News"}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {LT.newsDescription ||
              "Stay up to date with the latest Army Dragone updates and announcements"}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (item.id % 3) * 0.1 }}
            >
              {/* Card glow effect */}
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-700/30 opacity-0 blur transition duration-300 group-hover:opacity-100"></div>

              {/* Card content */}
              <div className="relative overflow-hidden rounded-xl border border-amber-700/30 bg-gray-900/70 backdrop-blur-sm">
                <div className="relative h-48 w-full overflow-hidden">
                  {item.imageType === "video" ? (
                    <video
                      autoPlay
                      muted
                      loop
                      className="h-full w-full object-cover"
                    >
                      <source src={item.image} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Category badge */}
                  <div className="absolute right-0 top-0 m-3">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-600/90 to-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-amber-900/20 backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>

                <div className="relative p-6">
                  {/* Decorative glow */}
                  <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-amber-500/10 blur-xl"></div>

                  <div className="mb-2 text-sm font-medium text-amber-400">
                    {item.date}
                  </div>
                  <Link href={`/news/${item.id}`}>
                    <h3 className="mb-3 text-xl font-bold text-white transition-colors duration-300 hover:text-amber-400">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="mb-4 text-gray-300">{item.excerpt}</p>
                  <Link
                    href={`/news/${item.id}`}
                    className="group inline-flex items-center rounded-full border border-amber-600/50 bg-amber-900/10 px-4 py-2 text-sm font-medium text-amber-400 backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-600/80 hover:to-amber-500/80 hover:text-white"
                  >
                    <span>{LT.readMore || "Read More"}</span>
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/news"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-lg shadow-amber-700/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative z-10 rounded-full bg-gradient-to-r from-amber-600/90 to-amber-500/90 px-8 py-3 font-bold text-white backdrop-blur-sm">
              <span className="flex items-center">
                {LT.moreNews || "More News"}
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7-7 7"
                  />
                </svg>
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
