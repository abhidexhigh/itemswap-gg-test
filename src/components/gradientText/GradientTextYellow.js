const GradientTextYellow = ({ value, grayscale = false, style = "" }) => {
  return (
    <span
      className={`bg-gradient-to-r from-[#FDF496] to-[#e6d94f] bg-clip-text text-center text-xs font-semibold text-transparent md:text-base ${grayscale ? "grayscale" : ""} ${style}`}
    >
      {value}
    </span>
  );
};

export default GradientTextYellow;
