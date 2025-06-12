const GradientText = ({ value, grayscale = false, style = "" }) => {
  return (
    <span
      className={`bg-gradient-to-r from-[#A3713B] via-[#FFF78F] to-[#C29C57] bg-clip-text text-center text-xs font-semibold text-transparent md:text-base ${grayscale ? "grayscale" : ""} ${style}`}
    >
      {value}
    </span>
  );
};

export default GradientText;
