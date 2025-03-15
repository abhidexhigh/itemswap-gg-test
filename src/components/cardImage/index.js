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
          <div className={`flex flex-col rounded-lg`}>
            <div
              className="relative inline-flex rounded-lg border-1"
              data-tooltip-id={src?.key}
            >
              {/* If src.cardImage extension is .webp or .png or .jpg or .jpeg, then use the Image component, else if it's .mp4 or .webm, then use the video component */}
              {src?.cardImage.endsWith(".webp") ||
              src?.cardImage.endsWith(".png") ||
              src?.cardImage.endsWith(".jpg") ||
              src?.cardImage.endsWith(".jpeg") ? (
                <Image
                  src={src?.cardImage}
                  alt={"champion"}
                  // style={imgStyle}
                  height={80}
                  width={80}
                  className={`object-cover object-center rounded-lg ${imgStyle}`}
                />
              ) : (
                <video
                  src={src?.cardImage}
                  alt={"champion"}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`object-cover object-center rounded-lg ${imgStyle}`}
                />
              )}
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
