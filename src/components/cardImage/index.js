import { OptimizedImage } from "../../utils/imageOptimizer";
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
              className="relative w-[48px] h-[48px] !bg-black md:w-[96px] md:h-[96px] rounded-lg"
              data-tooltip-id={src?.key}
            >
              {/* If src.cardImage extension is .webp or .png or .jpg or .jpeg, then use the Image component, else if it's .mp4 or .webm, then use the video component */}
              {src?.cardImage.endsWith(".webp") ||
              src?.cardImage.endsWith(".png") ||
              src?.cardImage.endsWith(".jpg") ||
              src?.cardImage.endsWith(".jpeg") ? (
                <OptimizedImage
                  src={src?.cardImage}
                  alt="champion"
                  width={80}
                  height={80}
                  className={`object-cover object-canter mx-auto rounded-lg w-auto h-full ${imgStyle}`}
                />
              ) : (
                <video
                  src={src?.cardImage}
                  alt="champion"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`object-cover object-center rounded-lg w-full h-full ${imgStyle}`}
                />
              )}
              <OptimizedImage
                src={
                  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744443307/ghjhhhhhhhh_axvnyo.png"
                }
                className="absolute top-0 right-0 w-full h-full"
                alt="Border Image"
                width={200}
                height={200}
              />
              <OptimizedImage
                src={
                  forces?.find((force) => force.key === src?.variant)?.imageUrl
                }
                alt="force"
                width={20}
                height={20}
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
