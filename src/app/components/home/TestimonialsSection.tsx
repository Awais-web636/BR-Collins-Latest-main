import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // Add Autoplay to imports
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"; // Add autoplay CSS
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    quote: "The online learning platform is user-friendly, and the courses are top-quality. A great investment!",
    author: "Valerie J.",
    role: "Creasman CEO",
    avatarSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/908baf5bca0653700b717ff9a12bfa4fcbf17d44?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
    ratingSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bc212420f985ef7c5d1da3a7e132891c3bfb3ac4?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
  },
  {
    quote: "B.R. Collins' business management course gave me the confidence to lead my team to success.",
    author: "Hannah R.",
    role: "Sutton CEO",
    avatarSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f24e7dc3c08e89a2508b97c949c626c39032de5f?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
    ratingSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/eedaec280656709f9f00fdc760c19c08697b6c7d?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
  },
  {
    quote: "The marketing strategies I learned helped double our company's revenue in just six months.",
    author: "Michael T.",
    role: "Marketing Director",
    avatarSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f24e7dc3c08e89a2508b97c949c626c39032de5f?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
    ratingSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/eedaec280656709f9f00fdc760c19c08697b6c7d?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
  },
  {
    quote: "The online learning platform is user-friendly, and the courses are top-quality. A great investment!",
    author: "Valerie J.",
    role: "Creasman CEO",
    avatarSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/908baf5bca0653700b717ff9a12bfa4fcbf17d44?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
    ratingSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/bc212420f985ef7c5d1da3a7e132891c3bfb3ac4?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
  },
  {
    quote: "B.R. Collins' business management course gave me the confidence to lead my team to success.",
    author: "Hannah R.",
    role: "Sutton CEO",
    avatarSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f24e7dc3c08e89a2508b97c949c626c39032de5f?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
    ratingSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/eedaec280656709f9f00fdc760c19c08697b6c7d?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca",
  },
];

export const TestimonialCard = ({
  quote,
  author,
  role,
  avatarSrc,
  ratingSrc,
  hasShadow = false,
}: {
  quote: string;
  author: string;
  role: string;
  avatarSrc: string;
  ratingSrc: string;
  hasShadow?: boolean;
}) => (
  <article
    className={`px-4  md:px-8 py-6 md:py-9 flex flex-col h-full bg-white rounded-xl border border-solid border-zinc-100  shadow-[0px_4px_34px_rgba(0,0,0,0.06)] w-full`}
  >
    <img
      src={
        hasShadow
          ? "https://cdn.builder.io/api/v1/image/assets/TEMP/4f53b01f4a2055025ae001d32242dd2156eb1d6f?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
          : "https://cdn.builder.io/api/v1/image/assets/TEMP/e3b511254abaa10feac72b54d94eff2df35b0d69?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
      }
      className="object-contain w-8 aspect-[1.68]"
      alt="Quote"
    />
    <blockquote className="mt-7 text-lg md:text-[26px] font-medium leading-6 md:leading-8 text-neutral-900">
      {quote}
    </blockquote>
    <div className="flex flex-col md:flex-row justify-between gap-4 mt-auto">
      <div className="flex gap-3 items-center">
        <img src={avatarSrc} className="object-contain rounded-full aspect-square w-10 md:w-[50px]" alt={author} />
        <div>
          <p className="text-base md:text-xl font-bold text-neutral-900">{author}</p>
          <p className="text-sm md:text-base leading-none text-zinc-500">{role}</p>
        </div>
      </div>
      <img src={ratingSrc} className="object-contain aspect-[2.51] w-20 md:w-[88px]" alt="Rating" />
    </div>
  </article>
);

const TestimonialsSection = () => {
  const swiperRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Reinitialize autoplay when screen size changes
      if (swiperRef.current) {
        if (mobile) {
          swiperRef.current.autoplay.start();
        } else {
          swiperRef.current.autoplay.stop();
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="text-gray-900 w-full mx-auto max-w-[1326px] relative mt-20 max-lg:mt-10 px-2">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Info Card */}
        <div className="flex flex-col items-start text-start justify-between p-6 h-[420px] w-full lg:w-[422px] bg-sky-500 rounded-xl relative z-10">
          <h2 className="text-2xl md:text-[34px] font-bold text-white">
            What subscribers are achieving through learning
          </h2>
          <p className="text-xl md:text-2xl text-white">
            <span className="font-semibold text-[#FF9270]">37,076</span>
            <span> responses collected</span>
          </p>
          <div className="flex justify-between bottom-0 w-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/130d72ee6184a472ad3edb3bbba812115cae9da8?placeholderIfAbsent=true&apiKey=46d0142291f54eac8dc073a4381485ca"
              className="object-contain w-[150px] md:w-[200px] rounded-none"
              alt="Learning statistics"
            />
            <div className="flex gap-2 items-center relative z-20">
              <button
                aria-label="Previous testimonial"
                className="p-2 bg-white/20 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <ArrowLeft className="text-white w-6 h-6" />
              </button>
              <button
                aria-label="Next testimonial"
                className="p-2 bg-white/20 rounded-full border-none cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <ArrowRight className="text-white w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="w-full lg:w-2/3 relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            loop={true} // Enable infinite loop
            autoplay={{
              delay: 1000, // 1 second delay
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
              waitForTransition: true, // Add this
            }}
            speed={600} // Smooth transition duration
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (isMobile) swiper.autoplay.start();
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: {
                slidesPerView: 2,
                autoplay: false,
              },
            }}
            className="h-[422px] lg:h-full"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="!bg-white">
                <TestimonialCard {...testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
