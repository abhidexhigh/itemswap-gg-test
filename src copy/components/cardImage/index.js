import ReactTltp from "../tooltip/ReactTltp";
const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w=[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
}) => {
  return (
    <div className="inline-flex flex-col items-center">
      <p
        className={`ellipsis text-center text-[11px] md:text-[18px] leading-[14px] text-[#ffffff] font-extralight
                                           w-full p-[2px] m-0 ${textStyle}`}
      >
        {src?.name}
      </p>
      <div className="inline-flex items-center justify-center flex-col">
        <div className="inline-flex flex-col">
          <div className={`flex flex-col rounded-[5px]`}>
            <div
              className="relative inline-flex rounded-[5px] border-1"
              data-tooltip-id={src?.key}
            >
              <img
                src={src?.imageUrl}
                // style={imgStyle}
                className={`object-cover object-center rounded-[5px] ${imgStyle}`}
              />
              <img
                src={src?.identificationImageUrl}
                className={`absolute -top-[6px] -right-[6px] w-[20px] md:w-[30px] ${identificationImageStyle}`}
              />
            </div>
            <ReactTltp variant="champion" id={src?.key} content={src} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImage;
