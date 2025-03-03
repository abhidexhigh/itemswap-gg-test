import Image from "next/image";
import ReactTltp from "../tooltip/ReactTltp";
const CardImage = ({
  src,
  imgStyle = "w-[48px] md:w-[96px]",
  identificationImageStyle = "w=[16px] md:w-[32px]",
  textStyle = "text-[10px] md:text-[16px]",
  forces,
}) => {
  return (
    <div className="inline-flex flex-col items-center">
      <div className="inline-flex items-center justify-center flex-col">
        <div className="inline-flex flex-col">
          <div className={`flex flex-col rounded-[5px]`}>
            <div
              className="relative inline-flex rounded-[5px] border-1"
              data-tooltip-id={src?.key}
            >
              <Image
                src={src?.cardImage}
                alt={"champion"}
                // style={imgStyle}
                height={80}
                width={80}
                className={`object-cover object-center rounded-[5px] ${imgStyle}`}
              />
              <Image
                src={
                  forces?.find((force) => force.key === src?.variant)?.imageUrl
                }
                alt={"force"}
                height={20}
                width={20}
                className={`absolute -top-[6px] -right-[6px] w-[20px] md:w-[30px] ${identificationImageStyle}`}
              />
              {/* <div className="absolute bottom-0 w-full bg-gradient-to-r from-[#1a1b3110] via-[#1a1b31] to-[#1a1b3110] bg-opacity-50">
                <p
                  className={`ellipsis text-center text-[11px] md:text-[16px] leading-[14px] text-[#ffffff] font-extralight
                                           w-full py-0.5 m-0 ${textStyle}`}
                >
                  {src?.name}
                </p>
              </div> */}
            </div>
            <ReactTltp variant="champion" id={src?.key} content={src} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardImage;
