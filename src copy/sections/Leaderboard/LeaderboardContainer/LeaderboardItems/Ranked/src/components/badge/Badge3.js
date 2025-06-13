import Image from "next/image";
import GradientText from "../gradientText/GradientText";

const Badge3 = ({ value }) => {
  return (
    <div className="relative w-full">
      <Image
        src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1736592230/Layer_1_r0cdyy.png"
        alt="Frame"
        width={100}
        height={100}
        // layout="fill"
        // objectFit="cover"
        className={`mx-auto w-20 md:w-36 ${value === "Defend" ? "grayscale" : ""}`}
      />
      <div className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 transform">
        <GradientText
          value={value}
          grayscale={value === "Defend" ? true : false}
        />
      </div>
    </div>
  );
};

export default Badge3;
