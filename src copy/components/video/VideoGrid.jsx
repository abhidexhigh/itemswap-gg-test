import { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import VideoCard from "./VideoCard";

export default function VideoGrid({ videoUrls, cardSize = 160, gap = 8 }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Track window size client‐side
  useEffect(() => {
    function update() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // how many columns fit across
  const columnCount = Math.floor(dimensions.width / (cardSize + gap)) || 1;
  const rowCount = Math.ceil(videoUrls.length / columnCount);

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={cardSize + gap}
      height={dimensions.height}
      rowCount={rowCount}
      rowHeight={cardSize + gap}
      width={dimensions.width}
      className="overflow-auto"
    >
      {({ columnIndex, rowIndex, style }) => {
        const idx = rowIndex * columnCount + columnIndex;
        if (idx >= videoUrls.length) return null;
        return (
          <div style={style} className="p-1">
            <VideoCard src={videoUrls[idx]} size={cardSize} />
          </div>
        );
      }}
    </Grid>
  );
}
