import React, { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

const InPersonPopup = dynamic(() => import("../inpersonBooking/InPersonPopup"), { ssr: false });

const OnSiteLearningSection = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Disable background scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showPopup]);

  return (
    <section className="mx-auto px-2 mb-20 md:px-4 xl:px-0 flex flex-col items-center text-gray-900 w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 w-full max-w-[1326px] px-1 md:px-4">
        {/* Content Column - Centered on medium, left on large */}
        <div className="w-full flex flex-col items-center lg:items-start lg:max-w-[529px] xl:max-w-[600px]">
          <div className="w-full flex flex-col items-center lg:items-start">
            <div className="flex flex-col items-center lg:items-start w-full font-bold">
              <span className="text-lg text-orange-500 uppercase">about us</span>
              <h2 className="mt-3 md:mt-5 text-3xl md:text-5xl leading-tight text-neutral-900 text-center lg:text-left">
                On Site Learning
              </h2>
            </div>
            <p className="mt-4 md:mt-5 text-lg md:text-2xl leading-6 md:leading-8 text-neutral-900 text-center lg:text-left">
              At B.R Collins, our on-site training transforms everyday lessons into engaging and interactive
              experiences. Blending creativity with expertise.
            </p>
          </div>
          <div className="mt-6 md:mt-10 w-full flex flex-col items-center lg:items-start">
            <FeatureCard
              title="Flexible Classes"
              description="It is a long established fact that a reader will be distracted by this on readable content of when looking at its layout."
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/0142af754e70f9fb9b82869b1b20e4421b6f04e5?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
              className="w-full"
            />
            <FeatureCard
              title="Expert-Led Training"
              description="Learn from industry experts in a real-world setting and Gain practical knowledge and get hands-on experience."
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/fdae32a59490e8eef0a907659d5abbdfaaf27880?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
              className="mt-4 md:mt-5 w-full"
            />
          </div>
          {/* Book On-Site Training Button */}
          <button
            className="mt-8 group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white text-base sm:text-lg md:text-xl font-semibold shadow-md hover:shadow-xl hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60"
            onClick={() => setShowPopup(true)}
          >
            Book On-Site Training
            <span className="inline-flex items-center justify-center w-5 h-5  lg:w-7 lg:h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition">
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </span>
          </button>
        </div>
        {/* Image - Centered on medium, right on large */}
        <div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ad81aa71094e8f17ed8df5001172ac5e3d12e12?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
            className="object-contain rounded-2xl aspect-[0.93] w-full max-w-full lg:max-w-[600px] xl:max-w-[700px] mt-8 lg:mt-0 lg:flex-1"
            alt="On-site learning"
          />
        </div>
      </div>
      {/* Modal for InPersonPopup */}
      {showPopup && (
        <div
          className={`fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center p-4 justify-center transition-opacity duration-300 ease-in-out ${
            showPopup ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={`transform transition-all duration-300 ease-in-out w-full md:w-auto ${
              showPopup ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <InPersonPopup onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
    </section>
  );
};

export default OnSiteLearningSection;
