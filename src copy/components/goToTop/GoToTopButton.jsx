"use client";
import { useState, useEffect } from "react";
// import { ArrowUp } from "lucide-react"; // You can replace it with any icon
import { IoArrowUpSharp } from "react-icons/io5";

export default function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 100px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Go to top"
    >
      <IoArrowUpSharp className="w-5 h-5" />
    </button>
  );
}
