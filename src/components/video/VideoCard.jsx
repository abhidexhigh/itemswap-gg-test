import { useRef, useState, useEffect } from "react";

export default function VideoCard({ src, size }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`w-[${size}px] h-[${size}px] bg-gray-200 rounded overflow-hidden flex items-center justify-center`}
    >
      {visible ? (
        <video
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-gray-300" />
      )}
    </div>
  );
}
