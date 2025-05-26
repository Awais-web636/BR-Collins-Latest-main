"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaInstagram, FaTelegramPlane, FaFacebookF } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "../../../public/icons/footer_icons";
import Link from "next/link";
const QuickLinks = () => {
  return (
    <div className="grow  max-md:mt-10 font-sans">
      <h3 className="text-lg gap-3 font-medium text-white">Quick Links</h3>
      <nav className="flex gap-2 flex-col justify-center mt-8 w-full text-lg ">
        <a href="/course" className=" self-start whitespace-nowrap hover:text-white transition-colors">
          Courses
        </a>
        <a href="/subscriptions" className=" self-start  whitespace-nowrap hover:text-white transition-colors">
          Subscriptions
        </a>
        <a href="/about" className=" hover:text-white transition-colors">
          About
        </a>
        <a href="/contact" className=" hover:text-white transition-colors">
          Contact Us
        </a>
        <a href="/login" className=" hover:text-white transition-colors">
          Login & Register
        </a>
      </nav>
    </div>
  );
};

const ContactInfo = () => {
  return (
    <div className="lg:min-h-[172px] h-auto font-sans max-md:mt-10">
      <h3 className="text-xl font-medium text-white">Get Contact</h3>
      <div className="flex flex-col mt-7 w-full">
        <div className="w-full ">
          <a
            href="tel:+14065550120"
            className="text-3xl font-semibold text-primary underline hover:text-orange-400 transition-colors"
          >
            (406) 555-0120
          </a>
          <a
            href="mailto:b.r.collins@example.com"
            className="block mt-5 text-lg underline font-medium text-[#A9BBC3] hover:text-white transition-colors"
          >
            b.r.collins@example.com
          </a>
        </div>
        <div className="flex gap-1.5 justify-center items-center self-start mt-5 text-base font-medium ">
          <MapPin className="w-5 h-5 text-blue-400" />
          <address className="gap-1 self-stretch my-auto not-italic hover:text-white transition-colors">
            North America, USA
          </address>
        </div>
      </div>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fakeSubmit = () => {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setSuccess(false);
    await fakeSubmit();
    setLoading(false);
    setSuccess(true);
    setEmail("");
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-fit items-start self-start mt-2 font-sans text-lg max-md:max-w-full">
      <h3 className="text-xl font-medium text-white max-md:mt-16 ">Join the Community</h3>
      <p className="mt-4 text-[A9BBC3]">2,000+ Students Globally – Connect & Say Hello!</p>
      <form onSubmit={handleSubmit} className="md:w-full my-4 flex flex-row justify-center md:justify-between gap-2">
        <div className="border-1 bg-[#16313F] border-gray-600 w-fit flex flex-row rounded-4xl p-1">
          <input
            type="email"
            className="border-none md:w-[473px] bg-transparent focus:outline-0 text-gray-400 p-[6px] px-5 placeholder-gray-400 rounded-4xl disabled:bg-gray-800"
            name="input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-14 h-14 rounded-full text-white bg-[#ff6900] flex items-center justify-center transition-opacity ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-500"
          }`}
          disabled={loading || !email}
          aria-label="Submit newsletter email"
        >
          {loading ? (
            <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <FaTelegramPlane className="w-8 h-8" />
          )}
        </button>
      </form>
      {success && <div className="text-green-400 text-base mt-2 transition-opacity">Thank you for joining! 🎉</div>}
    </div>
  );
};

const SocialIcon = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <a
    href="#"
    aria-label={label}
    className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
  >
    <Icon className="w-5 h-5 text-white" />
  </a>
);

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on course learning pages
  if (pathname?.startsWith("/courses/learn/")) {
    return null;
  }

  return (
    <footer className="flex flex-col items-center px-6 pt-20 pb-8 w-full text-[#A9BBC3] h-auto lg:h-[575px] bg-[#081B25] max-md:px-5 max-md:max-w-full">
      <div className="w-full max-w-[1326px] max-md:max-w-full">
        <div className="flex flex-wrap justify-between max-w-full w-full">
          <div className="flex-auto max-md:max-w-full">
            <div className="flex gap-20 max-md:flex-col">
              <div className="w-fit max-md:ml-0 max-md:w-full">
                <QuickLinks />
              </div>
              <div className=" w-fit max-md:ml-0 max-md:w-full">
                <ContactInfo />
              </div>
            </div>
          </div>
          <Newsletter />
        </div>

        <hr className="shrink-0 mt-10 h-px border border-solid border-gray-800 border-opacity-10 max-md:max-w-full" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between flex-wrap mt-8 w-full">
          <div>
            {/* Left Block - Fixed Width */}
            <svg width="241" height="57" viewBox="0 0 241 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_3036_2684)">
                <path
                  d="M40.5655 29.6535L38.1441 28.2293L39.2876 27.5722C47.7863 22.6882 49.3653 10.9612 42.1635 4.33986C39.3636 1.7655 35.2371 -0.0174669 29.1788 0.00403083C33.8927 4.03486 37.7697 13.4119 34.9386 19.1518C34.8925 19.2445 34.8315 19.352 34.7582 19.4716C33.593 21.3607 31.4876 22.4786 29.2534 22.4786H12.1585V10.8376H28.7434C31.082 10.8376 33.2484 12.0576 34.4449 14.0488C34.3295 13.3864 34.1749 12.7334 33.9809 12.0912C31.7996 4.84506 24.9017 0 17.2685 0H0V57H16.4804C19.4634 57 22.4247 56.4478 25.1879 55.3312C25.4457 55.2264 25.6586 55.1351 25.8024 55.0598C30.8718 52.4667 32.756 48.2921 34.4516 43.1541L33.8778 43.7439C32.3734 45.2891 30.2993 46.1611 28.1316 46.1611H12.1585V33.3162H28.2808C29.8991 33.3162 31.5039 33.7784 32.7953 34.7444C32.7967 34.7444 32.798 34.7471 32.8007 34.7485C37.8524 38.6382 37.3424 46.5346 36.679 50.5843C36.3426 52.6386 36.1541 54.7145 36.1541 56.7944V57H47.8215V42.2754C47.8215 37.0944 45.0637 32.2977 40.5668 29.6548L40.5655 29.6535Z"
                  fill="white"
                />
                <path
                  d="M61.7168 37.6438H64.7011V46.6944H66.6084V37.6438H69.5968V36.0771H61.7168V37.6438Z"
                  fill="white"
                />
                <path
                  d="M82.9353 38.9028C82.9353 37.0499 81.53 36.0771 79.5508 36.0771H75.3809V46.6944H77.2434V42.157H78.8427C80.3674 42.157 80.8504 42.6407 80.8504 43.9547V44.2114C80.8504 45.4502 80.8924 46.2563 81.0443 46.6944H82.8797C82.778 46.0884 82.7346 45.1841 82.7346 44.2302V43.983C82.7346 42.6219 82.3195 41.7754 81.237 41.3858C82.1133 41.0713 82.9353 40.3807 82.9353 38.9041V38.9028ZM78.9933 40.6535H77.2434V37.582H79.2985C80.3118 37.582 81.0471 38.02 81.0471 39.0559C81.0471 40.3377 80.1545 40.6548 78.9933 40.6548V40.6535Z"
                  fill="white"
                />
                <path
                  d="M91.7487 36.0771C91.3566 37.2461 88.7494 45.6638 88.3994 46.6944H90.2673L91.122 43.9292H94.7968L95.7002 46.6944H97.6957L94.1836 36.0771H91.7487ZM91.4977 42.3626C92.1204 40.3834 92.6304 38.7348 92.9031 37.5296H92.9234C93.154 38.4715 93.6559 40.0112 94.4047 42.3626H91.4977Z"
                  fill="white"
                />
                <path d="M105.356 36.0771H103.465V46.6944H105.356V36.0771Z" fill="white" />
                <path
                  d="M118.862 39.67C118.862 41.4005 118.877 43.1271 118.982 44.4398H118.955C118.78 43.948 118.244 42.9108 114.688 36.0771H112.25V46.6944H113.988V43.0895C113.988 41.1896 113.986 39.3744 113.908 38.0227H113.924C114.106 38.4365 114.473 39.2212 118.285 46.6957H120.605V36.0785H118.862V39.6713V39.67Z"
                  fill="white"
                />
                <path d="M129.384 36.0771H127.493V46.6944H129.384V36.0771Z" fill="white" />
                <path
                  d="M142.89 39.67C142.89 41.4005 142.905 43.1271 143.011 44.4398H142.984C142.809 43.948 142.273 42.9108 138.716 36.0771H136.278V46.6944H138.016V43.0895C138.016 41.1896 138.015 39.3744 137.936 38.0227H137.952C138.134 38.4365 138.502 39.2212 142.313 46.6957H144.633V36.0785H142.89V39.6713V39.67Z"
                  fill="white"
                />
                <path
                  d="M155.709 37.4572C157.204 37.4572 157.758 38.2486 158 39.0817H159.858C159.576 37.2759 158.269 35.9336 155.812 35.9336C152.708 35.9336 151.01 38.3857 151.01 41.4424C151.01 44.4991 152.446 46.8477 155.249 46.8477C156.656 46.8477 157.723 46.4715 158.278 45.359C158.305 45.8857 158.358 46.3614 158.426 46.6932H159.835V40.8351H155.536V42.4394H157.961V42.4944C157.961 44.0624 157.497 45.3348 155.649 45.3348C153.802 45.3348 152.958 43.5572 152.958 41.4518C152.958 39.3464 153.723 37.4546 155.707 37.4546L155.709 37.4572Z"
                  fill="white"
                />
                <path
                  d="M178.802 37.4572C180.296 37.4572 180.851 38.2486 181.093 39.0817H182.951C182.669 37.2759 181.361 35.9336 178.905 35.9336C175.801 35.9336 174.103 38.3857 174.103 41.4424C174.103 44.4991 175.539 46.8477 178.342 46.8477C179.748 46.8477 180.816 46.4715 181.371 45.359C181.398 45.8857 181.451 46.3614 181.519 46.6932H182.928V40.8351H178.629V42.4394H181.053V42.4944C181.053 44.0624 180.589 45.3348 178.742 45.3348C176.894 45.3348 176.051 43.5572 176.051 41.4518C176.051 39.3464 176.816 37.4546 178.8 37.4546L178.802 37.4572Z"
                  fill="white"
                />
                <path
                  d="M197.099 38.9028C197.099 37.0499 195.693 36.0771 193.715 36.0771H189.545V46.6944H191.407V42.157H193.007C194.532 42.157 195.014 42.6407 195.014 43.9547V44.2114C195.014 45.4502 195.056 46.2563 195.208 46.6944H197.044C196.942 46.0884 196.899 45.1841 196.899 44.2302V43.983C196.899 42.6219 196.484 41.7754 195.401 41.3858C196.277 41.0713 197.099 40.3807 197.099 38.9041V38.9028ZM193.157 40.6535H191.407V37.582H193.463C194.476 37.582 195.211 38.02 195.211 39.0559C195.211 40.3377 194.319 40.6548 193.157 40.6548V40.6535Z"
                  fill="white"
                />
                <path
                  d="M207.711 35.9336C204.391 35.9336 202.94 38.6463 202.94 41.3174C202.94 44.3903 204.381 46.8491 207.569 46.8491C210.757 46.8491 212.334 44.3836 212.334 41.3309C212.334 38.2782 210.853 35.9336 207.711 35.9336ZM207.654 45.3362C205.811 45.3362 204.902 43.5613 204.902 41.3148C204.902 39.0682 205.719 37.4465 207.631 37.4465C209.544 37.4465 210.396 39.2187 210.396 41.3349C210.396 43.65 209.634 45.3362 207.654 45.3362Z"
                  fill="white"
                />
                <path
                  d="M224.809 42.8274C224.809 44.2463 224.411 45.3319 222.686 45.3319C220.96 45.3319 220.517 44.1966 220.517 42.8328V36.0785H218.616V42.9161C218.616 45.2513 219.619 46.8489 222.644 46.8489C225.669 46.8489 226.724 45.1076 226.724 42.8785V36.0771H224.809V42.8274Z"
                  fill="white"
                />
                <path
                  d="M237.325 36.0771H233.497V46.6944H235.393V42.4365H237.143C239.416 42.4365 241.001 41.3374 241.001 39.1715C241.001 37.0056 239.334 36.0771 237.327 36.0771H237.325ZM237.034 40.9397H235.393V37.582H237.084C238.26 37.582 239.074 38.0711 239.074 39.2104C239.074 40.4949 238.276 40.941 237.034 40.941V40.9397Z"
                  fill="white"
                />
                <path
                  d="M75.1202 19.7949C76.5527 19.2346 77.9119 17.981 77.9119 15.4953C77.9119 12.7167 76.0019 10.0752 70.8715 10.0752H61.3867V31.2384H70.725C75.7265 31.2384 78.6064 28.6936 78.6064 24.82C78.6064 21.9312 76.7656 20.4304 75.1202 19.7949ZM67.099 13.977H69.6629C71.2066 13.977 72.1955 14.6368 72.1955 16.1308C72.1955 17.6249 71.3938 18.2645 69.5313 18.2645H67.0977V13.977H67.099ZM69.7239 27.3567H67.099V22.0589H69.4797C71.5837 22.0589 72.5645 22.9591 72.5645 24.7219C72.5645 26.6527 71.2934 27.3554 69.7239 27.3554V27.3567Z"
                  fill="white"
                />
                <path d="M85.1935 25.5928H80.0645V31.2279H85.1935V25.5928Z" fill="white" />
                <path
                  d="M104.169 15.8769C104.169 12.5179 101.608 10.0752 96.9171 10.0752H87.1719V31.2384H92.9059V23.1096H94.9407C97.2115 23.1096 97.944 23.7733 97.944 25.9849V26.5828C97.944 29.0107 98.0485 30.3637 98.3605 31.2384H104.013C103.835 30.2052 103.765 28.3564 103.765 26.5882V25.9352C103.765 23.5006 103.102 21.7095 100.88 20.8644C102.711 20.1429 104.168 18.7186 104.168 15.8756L104.169 15.8769ZM95.3829 18.9551H92.9073V14.2081H95.756C97.2508 14.2081 98.37 14.8477 98.37 16.5057C98.37 18.2981 97.1328 18.9565 95.3829 18.9565V18.9551Z"
                  fill="white"
                />
                <path d="M111.344 25.5928H106.215V31.2279H111.344V25.5928Z" fill="white" />
                <path
                  d="M128.221 27.3499C125.468 27.3499 124.571 24.6143 124.571 20.6788C124.571 16.7434 125.458 13.9823 128.213 13.9823C130.514 13.9823 131.043 15.4105 131.349 17.0202H137.13C136.963 13.7619 134.8 9.7002 128.303 9.7002C121.805 9.7002 118.464 14.642 118.464 20.699C118.464 26.756 120.876 31.6346 128.094 31.6346C133.943 31.6346 136.649 28.3791 137.233 24.2098H131.432C131.154 25.6556 130.537 27.3512 128.22 27.3512L128.221 27.3499Z"
                  fill="white"
                />
                <path
                  d="M148.836 9.69922C141.614 9.69922 138.623 15.0132 138.623 20.5233C138.623 26.6972 141.554 31.6337 148.503 31.6337C155.818 31.6337 158.759 26.7281 158.759 20.5422C158.759 14.817 155.738 9.69922 148.836 9.69922ZM148.722 27.3717C145.956 27.3717 144.749 24.5609 144.749 20.5005C144.749 16.4401 145.815 13.9732 148.65 13.9732C151.751 13.9732 152.652 16.7559 152.652 20.4884C152.652 24.7853 151.72 27.3717 148.721 27.3717H148.722Z"
                  fill="white"
                />
                <path d="M167.011 10.0752H161.117V31.2384H175.446L176.044 26.8193H167.011V10.0752Z" fill="white" />
                <path d="M183.394 10.0752H177.5V31.2384H191.829L192.427 26.8193H183.394V10.0752Z" fill="white" />
                <path d="M199.777 10.0752H193.883V31.2384H199.777V10.0752Z" fill="white" />
                <path
                  d="M215.667 14.7281C215.667 18.0159 215.742 21.641 215.96 24.1146H215.854C215.597 23.2251 214.676 20.7865 210.154 10.0752H203.024V31.2384H208.404V26.5076C208.404 22.8449 208.395 19.2212 208.206 16.5635H208.27C208.54 17.3576 209.255 19.2615 214.179 31.2384H221.058V10.0752H215.667V14.7281Z"
                  fill="white"
                />
                <path
                  d="M233.01 18.0095C230.153 17.2073 229.202 16.8257 229.202 15.5157C229.202 14.3844 229.988 13.7206 231.438 13.7206C233.326 13.7206 233.938 14.8103 234.11 16.1338H239.68C239.441 12.2171 236.7 9.69922 231.414 9.69922C226.942 9.69922 223.437 11.8974 223.437 16.1633C223.437 19.126 225.035 21.1333 230.353 22.5589C233.264 23.3516 234.285 24.0396 234.285 25.57C234.285 26.7268 233.663 27.5424 231.698 27.5424C229.734 27.5424 228.742 26.4903 228.517 24.7705H222.895C223.133 28.9921 226.242 31.6149 231.525 31.6149C237.187 31.6149 240.209 28.9545 240.209 24.9264C240.209 21.7151 238.644 19.5963 233.009 18.0081L233.01 18.0095Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_3036_2684">
                  <rect width="241" height="57" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Right Block - Fills Remaining Space */}
          <div className="flex justify-end max-sm:justify-start max-[521px]:mt-4 w-fit  gap-4 items-center  min-h-[52px]">
            <Link
              href="https://www.facebook.com/"
              className="w-12 h-12 p-2 text-gray-400 bg-[#16313f] rounded-full"
              target="_blank"
            >
              <FacebookIcon className="w-8 h-7" />
            </Link>
            <Link
              href="https://www.x.com/"
              className="w-12 h-12 p-3 text-gray-400 bg-[#16313f] rounded-full "
              target="_blank"
            >
              <XIcon className="w-6 h-6" />
            </Link>
            <Link
              href="https://www.linkedin.com/"
              className="w-12 h-12 p-3 text-gray-400 bg-[#16313f] rounded-full "
              target="_blank"
            >
              <LinkedInIcon className="w-6 h-6" />
            </Link>
            <Link
              href="https://www.instagram.com/"
              className="w-12 h-12 p-3  text-gray-400 bg-[#16313f] rounded-full "
              target="_blank"
            >
              <InstagramIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>

        <hr className="shrink-0 mt-8 h-px border border-solid border-gray-800 border-opacity-10 max-md:max-w-full" />

        <div className="flex flex-col xl:flex-row flex-wrap gap-5 xl:justify-between mt-12 w-full text-base text-[#22485c] max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-wrap gap-5 items-center max-xl:justify-center min-h-[21px] max-md:max-w-full">
            <p className="text-center xl:self-stretch my-auto">Copyright © 2025 B.R. Collins All Rights Reserved</p>
            <div className="flex gap-3 items-center xl:self-stretch my-auto font-semibold text-right underline min-w-60">
              <Link href="/terms" className="self-stretch my-auto hover:text-white transition-colors">
                Terms of service
              </Link>
              <Link href="/privacy" className="self-stretch my-auto hover:text-white transition-colors">
                Privacy policy
              </Link>
            </div>
          </div>
          <p className="font-medium text-center xl:text-right">
            <span className="font-normal">Design and Developed by </span>
            <a href="#" className="font-normal underline hover:text-white transition-colors">
              Agency Partner Interactive
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
