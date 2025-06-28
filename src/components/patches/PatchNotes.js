// pages/patch-notes.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import GradientTextYellow from "src/components/gradientText/GradientTextYellow";
import { parsePatchNotes } from "src/utils/patchParser";

export default function PatchNotes() {
  const { t } = useTranslation();
  const LT = t("landing");
  const [activeVersion, setActiveVersion] = useState(null);
  const [patchNotes, setPatchNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTweets = async () => {
      try {
        const response = await fetch("/api/tweets", {
          signal: abortController.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tweets");
        }
        if (data.tweets.length > 0) {
          const parsedTweets = data.tweets.map((tweet) => {
            const parsed = parsePatchNotes(tweet);
            return parsed;
          });
          console.log("parsedTweets", parsedTweets);
          setPatchNotes(parsedTweets);

          const latestNote =
            parsedTweets.find((note) => note.latest) || parsedTweets[0];
          setActiveVersion(latestNote.version);
          setLoading(false);
        } else {
          setError("No patch notes found");
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted", err);
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchTweets();

    // Cleanup function to abort any pending requests
    return () => {
      abortController.abort();
    };
  }, []);

  // Fetch patch notes from the JSON file
  // useEffect(() => {
  //   async function fetchPatchNotes() {
  //     try {
  //       const response = await fetch("/api/patch-notes");
  //       const data = await response.json();

  //       if (data.success && data.patchNotes.length > 0) {
  //         console.log("data", data.patchNotes);
  //         setPatchNotes(data.patchNotes);
  //         // Set active version to the latest patch note
  //         const latestNote =
  //           data.patchNotes.find((note) => note.latest) || data.patchNotes[0];
  //         setActiveVersion(latestNote.version);
  //       } else {
  //         setError("No patch notes found");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching patch notes:", err);
  //       setError("Failed to load patch notes");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchPatchNotes();
  // }, []);

  // return (
  //   <div>
  //     <h1>Patch Notes</h1>
  //     <p>Patch notes for the game</p>
  //   </div>
  // );

  // Render loading state
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-xl text-amber-200">Loading patch notes...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="patch-notes-content py-2 text-gray-100">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar - Version List */}
        <aside className="flex-shrink-0 md:w-64">
          <div className="relative overflow-hidden rounded-xl backdrop-blur-sm">
            <div className="absolute inset-0 rounded-xl bg-[#191f1f]"></div>
            <div className="relative rounded-xl border border-[#d6b223] bg-[#191f1f] py-5 px-2 backdrop-blur-sm">
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-amber-500/10 blur-xl"></div>
              <GradientTextYellow
                value={LT.versionHistory || "Version History"}
                style="!text-xl"
              />
              <nav className="mt-4 space-y-2">
                {patchNotes.map((patch) => (
                  <motion.button
                    key={patch.version}
                    onClick={() => setActiveVersion(patch.version)}
                    className={`block w-full rounded-md px-3 py-2 text-left transition-colors duration-200 ${
                      activeVersion === patch.version
                        ? "bg-gradient-to-r from-[#d6b223] to-amber-500/80 font-medium text-white shadow-md shadow-amber-900/20"
                        : "text-gray-300 hover:bg-gradient-to-r hover:from-[#d6b22370] hover:to-[#f1d04a70]"
                    }`}
                    whileHover={{ x: patch.latest ? 0 : 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{patch.version}</span>
                      <span className="text-xs opacity-75">{patch.date}</span>
                    </div>
                  </motion.button>
                ))}
                <div className="mt-6 border-t border-amber-800/30 pt-4">
                  <motion.a
                    href="https://twitter.com/ItemSwap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d6b223] to-amber-500 px-4 py-3 text-center font-semibold text-white shadow-lg shadow-amber-900/30 transition-all duration-200 hover:from-[#d6b223] hover:to-amber-500 hover:shadow-xl hover:shadow-amber-900/40"
                    whileHover={{ scale: 1.02 }}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    See More
                  </motion.a>
                </div>
              </nav>
            </div>
          </div>
        </aside>

        {/* Patch Notes Content */}
        <div className="flex-1 overflow-hidden">
          {activeVersion &&
            patchNotes
              .filter((patch) => patch.version === activeVersion)
              .map((patch) => (
                <motion.div
                  key={patch.version}
                  className="animate-fadeIn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Patch Header */}
                  <div className="relative overflow-hidden rounded-t-xl backdrop-blur-sm">
                    <div className="relative rounded-t-xl border border-[#d2b43e] p-6 shadow-lg backdrop-blur-sm">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#584a12] blur-3xl"></div>

                      <div className="flex flex-col justify-between md:flex-row md:items-baseline">
                        <div>
                          <h2 className="text-3xl font-bold text-amber-100">
                            {patch.version}: {patch.title}
                          </h2>
                          <p className="mt-1 text-amber-200">
                            Released on {patch.date}
                          </p>
                        </div>
                        {patch.latest && (
                          <div className="mt-4 md:mt-0">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 px-3 py-1 text-sm font-medium text-amber-100 shadow-md backdrop-blur-sm">
                              Latest Update
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-amber-200">
                          Highlights:
                        </h3>
                        <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {patch.highlights.map((highlight, index) => (
                            <li
                              key={index}
                              className="relative overflow-hidden backdrop-blur-sm"
                            >
                              <div className="overflow-hidden rounded-xl !rounded-tl-none bg-gradient-to-r from-[#FDF496] to-[#6D4600] p-[1px]">
                                <div className="relative flex items-center rounded-xl !rounded-tl-none bg-[#191F1F] px-4 py-3">
                                  <span className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-amber-300"></span>
                                  <span className="text-amber-100">
                                    {highlight}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Patch Categories */}
                  <div className="relative overflow-hidden rounded-b-xl backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800/80 to-gray-900/80 blur-[1px]"></div>
                    <div className="relative space-y-8 rounded-b-xl border border-t-0 border-[#d2b43e] bg-[#191f1f] p-6 backdrop-blur-sm">
                      {patch.categories.map((category, index) => (
                        <div
                          key={index}
                          className="border-b border-amber-800/30 pb-6 last:border-0 last:pb-0"
                        >
                          <h3 className="mb-4 flex items-center text-xl font-bold text-amber-400">
                            <span className="mr-3 inline-block h-6 w-1 bg-gradient-to-b from-[#FDF496] to-[#e6d94f]"></span>
                            <GradientTextYellow
                              value={category.name}
                              style="!text-xl"
                            />
                          </h3>
                          <ul className="space-y-3 text-amber-100">
                            {category.changes.map((change, idx) => (
                              <li key={idx} className="flex">
                                <span className="mr-2 text-amber-400">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
