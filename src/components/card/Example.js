"use client";

import LightBeamCard from "./LightBeamCard";
import AmbientGlowCard from "./AmbientGlowCard";
import ShimmeryTrailCard from "./ShimmeryTrailCard";
import AuroraCard from "./AuroraCard";
import DustParticleCard from "./DustParticleCard";
import MistyFlowCard from "./MistyFlowCard";
import StarfieldCard from "./StarfieldCard";

export default function Example() {
  return (
    <div className="p-8 bg-slate-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-white mb-8">
        Card Variants with Animated Lights
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Light Beam
          </h2>
          <LightBeamCard image="/sample-image-1.jpg" name="Crystal Mage" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Beams of light converging toward the center
          </p>
        </div>

        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Ambient Glow
          </h2>
          <AmbientGlowCard image="/sample-image-2.jpg" name="Astral Seer" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Slow pulsing orbs in gentle orbits
          </p>
        </div>

        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Shimmery Trail
          </h2>
          <ShimmeryTrailCard image="/sample-image-3.jpg" name="Golden Guard" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Glowing particles flowing along the edges
          </p>
        </div>

        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Aurora
          </h2>
          <AuroraCard image="/sample-image-4.jpg" name="Frost Warden" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Gentle waves of aurora lights with stars
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Dust Particles
          </h2>
          <DustParticleCard image="/sample-image-5.jpg" name="Light Keeper" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Floating dust motes in a warm beam of light
          </p>
        </div>

        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Misty Flow
          </h2>
          <MistyFlowCard image="/sample-image-6.jpg" name="Fog Walker" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Ethereal mist that slowly flows along the bottom
          </p>
        </div>

        <div className="w-[250px]">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            Starfield
          </h2>
          <StarfieldCard image="/sample-image-7.jpg" name="Star Gazer" />
          <p className="mt-4 text-sm text-slate-300 text-center">
            Twinkling stars with rare shooting stars
          </p>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-center max-w-2xl">
        All card variants feature slow-moving light animations that create a
        mesmerizing effect while maintaining a subtle and non-distracting
        presence. Each design uses different animation techniques and color
        schemes to create a unique visual identity.
      </p>
    </div>
  );
}
