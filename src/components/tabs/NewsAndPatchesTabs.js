import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import PatchNotes from "src/components/patches/PatchNotes";
import NewsSection from "src/components/news/NewsSection";
import Image from "next/image";
import GradientText from "src/components/gradientText/GradientText";

const NewsAndPatchesTabs = () => {
  const { t } = useTranslation();
  const LT = t("landing");
  const [activeTab, setActiveTab] = useState("patches");

  const tabs = [
    { id: "patches", label: LT.patchNotes || "Patch Notes" },
    { id: "news", label: LT.news || "News" },
  ];

  return (
    <section id="news" className="relative w-full overflow-hidden py-24">
      {/* Background Elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-600/10 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-700/10 blur-3xl"></div>

      <div className="container relative mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* <h2 className="mb-4 inline-block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            {LT.latestUpdates || "Latest Updates"}
          </h2> */}
          <GradientText
            value={LT.latestUpdates || "Latest Updates"}
            style="!text-5xl"
          />
          <Image
            src={
              "https://res.cloudinary.com/dg0cmj6su/image/upload/v1736245309/rule_1_1_otljzg.png"
            }
            alt="Border"
            width={100}
            height={100}
            className="mx-auto mt-2 w-48"
          />
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-300">
            Stay informed about the latest updates for Army Dragone
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-12 flex hidden justify-center">
          <div className="mx-auto flex w-fit items-center justify-center rounded-full bg-gradient-to-b from-[#ffffff30] to-[#64646430] px-2 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-full ${
                  activeTab === tab.id ? "bg-[#013838]" : ""
                } px-6 py-2 text-xs font-bold text-white md:text-base`}
                style={{
                  boxShadow: `${
                    activeTab === tab.id
                      ? "inset 0 2px 4px rgba(0, 0, 0, 0.4)"
                      : "none"
                  }`,
                }}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[1200px]"
          >
            <div className="relative">
              {/* <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-700/30 blur-sm"></div> */}
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-[1px] shadow-lg shadow-[#d2b43e10] backdrop-blur-sm">
                <div className="relative rounded-xl bg-[#191f1f] p-2 backdrop-blur-sm md:p-8">
                  {activeTab === "patches" ? <PatchNotes /> : <NewsSection />}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsAndPatchesTabs;
