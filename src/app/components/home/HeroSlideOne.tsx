import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BookIcon } from "lucide-react";

interface HeroSlideOneProps {
  isLoading: boolean;
  firstCourse: any;
}

const HeroSlideOne: React.FC<HeroSlideOneProps> = ({ isLoading, firstCourse }) => (
  <section className="relative w-full">
    <div className="w-full">
      {isLoading || !firstCourse ? (
        <div className="w-full h-[350px] lg:h-[500px] bg-gray-200 animate-pulse" />
      ) : (
        <Image
          src={"/assets/homepagewall.png"}
          width={1920}
          height={1080}
          alt="wallpaper"
          className="w-full h-[300px] lg:h-[500px] object-cover  object-right-top"
          priority
        />
      )}
    </div>
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-[linear-gradient(to_right,#F4F6F9,transparent)] md:bg-[linear-gradient(to_right,#F4F6F9,#E9ECF2,_transparent,_transparent)] pointer-events-none flex items-center">
      <div className="w-full p-4 md:p-8 lg:p-0 md:max-w-[1326px] mx-auto">
        <div className="flex flex-col p-4 md:p-4 xl:p-0 justify-start gap-3 md:gap-4 w-full max-w-2xl pointer-events-auto">
          <h2 className="font-hanken text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-start text-gray-900">
            {isLoading || !firstCourse ? (
              <span className="bg-gray-200 rounded w-2/3 h-8 inline-block animate-pulse" />
            ) : (
              firstCourse.title
            )}
          </h2>
          <div className="flex flex-row items-center gap-2">
            <Image src="/assets/person.png" width={40} height={40} alt="person" className="w-10 h-10 hidden sm:block" />
            <div className="font-light text-sm sm:text-base text-gray-800">
              Instructor:
              <span className="font-medium ml-1">
                {isLoading || !firstCourse ? (
                  <span className="bg-gray-200 rounded w-16 h-4 inline-block animate-pulse" />
                ) : (
                  firstCourse.instructor
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center bg-[#FFCA7E] rounded-lg text-sm px-3 py-1 border border-gray-300 text-black font-medium">
              <Image src="/assets/congrateicon.png" width={16} height={16} className="mr-2 w-4 h-4" alt="congrats" />
              <h3>Bestseller</h3>
            </div>
            <div className="font-medium text-sm sm:text-base flex flex-col sm:flex-row sm:items-center gap-2 text-gray-900">
              <div className="flex items-center gap-2">
                {isLoading || !firstCourse ? (
                  <span className="bg-gray-200 rounded w-8 h-4 inline-block animate-pulse" />
                ) : (
                  firstCourse.rating || 4.5
                )}
                <div className="text-yellow-500 flex items-center text-sm">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-black">10+ ratings</div>
                <div className="w-px h-4 bg-black/30"></div>
                <div className="text-black flex items-center gap-2">
                  <BookIcon className="w-5 h-5" />
                  <p>{firstCourse?.noOfLessons} lessons</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href={`/course/${firstCourse?._id}?type=in-person`}
              className="bg-primary hover:bg-primary-hover transition-all duration-200 text-white rounded-full px-4 md:px-5 py-1 md:py-2 font-medium text-sm cursor-pointer"
            >
              In Person Training
            </Link>
            <Link
              href={`/course/${firstCourse?._id}?type=e-learning`}
              className="bg-primary hover:bg-primary-hover transition-all duration-200 text-white rounded-full px-4 md:px-5 py-1 md:py-2 font-medium text-sm cursor-pointer"
            >
              E-Learning
            </Link>
            <div className="text-sm text-gray-700">
              Start{" "}
              <span className="font-bold">
                {isLoading || !firstCourse ? (
                  <span className="bg-gray-200 rounded w-12 h-4 inline-block animate-pulse" />
                ) : firstCourse.startDate ? (
                  new Date(firstCourse.startDate).toLocaleDateString()
                ) : (
                  "Soon"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSlideOne;
