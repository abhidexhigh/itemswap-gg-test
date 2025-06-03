import Link from "next/link";
import Image from "next/image";
import React from "react";

const VideoBackground = () => {
  return (
    <div className="relative w-screen h-screen">
      {/* Full-screen video background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dg0cmj6su/video/upload/v1740649052/Nine_Tails_Summoning_V15_nz02k3.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* Dark Overlay */}
      <div className="absolute inset-0 !bg-black !opacity-20"></div>

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        {/* Brand Name (Top-Left) */}
        <div className="text-white font-bold text-xl">ArmyDragon</div>
        {/* Navigation Links (Top-Right) */}
        <ul className="flex space-x-6 text-white">
          <li className="cursor-pointer hover:underline">RPG</li>
          <li className="cursor-pointer hover:underline">ARENA</li>
          <li className="cursor-pointer hover:underline">Support</li>
          <li className="cursor-pointer hover:underline">Contact</li>
        </ul>
      </nav>
      {/* Overlay content */}
      <div className="relative flex items-center justify-center h-full"></div>
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2">
        <Image
          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650877/ArmyDragone_text_copy_kelovj.png"
          alt="Arena"
          width={300}
          height={300}
          className="w-96"
        />
      </div>
      {/* Download Button */}
      <div className="relative">
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <Image
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650876/Download_button_ojtyb1.png"
            alt="Arena"
            width={300}
            height={300}
            className="w-60"
          />
          <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-2xl !text-white">
            DOWNLOAD
          </p>
        </div>
      </div>
      {/* RPG and ARENA */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center items-center gap-x-16 p-6">
        <div className="relative hover:scale-110 shadow-md hover:shadow-xl hover:-translate-x-2 hover:-translate-y-2 transition-all duration-300 ease-in-out">
          <Image
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650871/RPG_yg3ket.png"
            alt="Arena"
            width={300}
            height={300}
            className="w-60"
          />
          <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-3xl !text-white">
            RPG
          </p>
        </div>
        <Link
          href="#"
          className="relative hover:scale-110 shadow-md hover:shadow-xl hover:translate-x-2 hover:-translate-y-2 transition-all duration-300 ease-in-out"
        >
          <Image
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650879/Arena_xbx8ex.png"
            alt="Arena"
            width={300}
            height={300}
            className="w-60 "
          />
          <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-3xl !text-white">
            ARENA
          </p>
        </Link>
      </div>
      {/* Download Buttons */}
      <div className="absolute bottom-24 left-10">
        <div className="flex flex-col gap-y-2">
          <a href="#" className="">
            <Image
              src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650873/Googleplay_ixxu3e.png"
              alt="Arena"
              width={300}
              height={300}
              className="w-36"
            />
          </a>
          <a href="#" className="">
            <Image
              src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650882/AppStore_ubkqir.png"
              alt="Arena"
              width={300}
              height={300}
              className="w-36"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoBackground;
