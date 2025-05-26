"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Cart from "./Cart/Cart";
import { ShoppingCart, Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { logout } from "@/app/store/features/users/userSlice";
import { toggleCart, toggleCartVisiblity, clearCart } from "@/app/store/features/cart/cartSlice";
import { IUser } from "../types/user.contract";
import Image from "next/image";
import { useCourseContext } from "./context/CourseContext";

const isValidProfilePicture = (url: string | undefined): url is string => {
  return typeof url === "string" && url.length > 0;
};

const toTitleCase = (str?: string) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const Navigation = () => {
  const pathname = usePathname();

  // Hide navigation on course learning pages
  if (pathname?.startsWith("/courses/learn/")) {
    return null;
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [DropdownMenu, setDropDownMenu] = useState(false);
  const [isDropdownOpenMobile, setIsDropdownOpenMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.user.accessToken !== null);
  const user = useAppSelector((state) => state.user.user);
  const { items, isCartOpen } = useAppSelector((state) => state.cart);
  const cart = useAppSelector((state) => state.cart);
  const profilePicture = (user as IUser).profilePicture;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearchDropdown, setShowMobileSearchDropdown] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchDropdownRef = useRef<HTMLDivElement>(null);
  const { courses, isLoading: isCoursesLoading } = useCourseContext();

  // Filtered results for desktop
  const filteredCourses = searchQuery.trim()
    ? courses.filter((c) => c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];
  // Filtered results for mobile
  const filteredMobileCourses = mobileSearchQuery.trim()
    ? courses.filter((c) => c.title.toLowerCase().includes(mobileSearchQuery.trim().toLowerCase()))
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target as Node)) {
        setShowMobileSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    switch (pathname) {
      case "/course":
        setSelectedOption("Courses");
        break;
      case "/about":
        setSelectedOption("About");
        break;
      case "/contact":
        setSelectedOption("Contact");
        break;
      default:
        setSelectedOption("Courses");
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoute = e.target.value;
    router.push(selectedRoute);
  };

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    // Use both router.replace and window.location.replace for extra safety
    router.replace("/login");
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.replace("/login");
      }, 100);
    }
  };

  const handleOpenCart = () => {
    dispatch(toggleCart());
    setTimeout(() => {
      dispatch(toggleCartVisiblity());
    }, 300);
  };

  const handleCloseCart = () => {
    dispatch(toggleCart());
    dispatch(toggleCartVisiblity());
  };

  const handleSearch = () => {
    setShowSearchDropdown(true);
  };

  const handleMobileSearch = () => {
    setShowMobileSearchDropdown(true);
  };

  return (
    <nav className="relative text-gray-900 flex items-center justify-between my-5 w-full max-w-[1326px] mx-auto lg:px-5 xl:px-0 ">
      {/* Mobile Header */}
      <div className="flex items-center justify-between w-full lg:hidden">
        <div className="flex items-center gap-5">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-900">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <a href="/">
            <img
              src="/img/logo.svg"
              className="object-contain aspect-[4.22] 2xl:w-[241px] xl:w-[221px] md:w-[171px] lg:w-[220px]  w-[121px]"
              alt="Logo"
            />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              handleOpenCart();
            }}
            className="relative p-2"
          >
            <ShoppingCart className="w-6 h-6 text-[#AEB5B9]" />
            {items.length > 0 && (
              <div className="absolute top-0 right-0 text-xs py-1 px-2 rounded-full bg-blue-200">{items.length}</div>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-10 flex-1">
          <a href="/">
            <img
              src="/img/logo.svg"
              className="object-contain aspect-[4.22] min-w-60 2xl:w-[241px] xl:w-[241px] md:w-[201px] lg:w-[221px]  w-[191px]"
              alt="Logo"
            />
          </a>

          <div className="flex gap-2.5 items-center w-full max-w-[500px]">
            <div className="flex flex-col justify-center items-start px-5 py-3 w-full bg-white border border-solid border-zinc-200 rounded-[66px] relative">
              <div className="flex gap-2 justify-center items-center w-full">
                <img src="/img/search.svg" className="object-contain w-5 aspect-square" alt="Search icon" />
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              {/* Search Dropdown (Desktop) */}
              {showSearchDropdown && (searchQuery.trim() || isCoursesLoading) && (
                <div
                  ref={searchDropdownRef}
                  className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto"
                  style={{ minWidth: 0 }}
                >
                  {isCoursesLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading courses...</div>
                  ) : filteredCourses.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {filteredCourses.map((course) => (
                        <li key={course._id}>
                          <Link
                            href={`/course/${course._id}`}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowSearchDropdown(false)}
                          >
                            <img
                              // src={course.coverImageUrl || "/img/Course/Course.png"}
                              src={"/img/Course/Course.png"}
                              alt={course.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-gray-900">{course.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found.</div>
                  )}
                </div>
              )}
            </div>

            <div className="relative w-full flex flex-row items-center justify-center max-w-[120px] m-auto mr-2">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full appearance-none flex flex-row items-center px-3 py-2 text-sm text-orange-500 bg-white border border-orange-500 border-solid min-h-[42px] rounded-[58px] cursor-pointer"
              >
                {selectedOption}
                <img
                  src="/img/downarrow.svg"
                  className="pointer-events-none absolute right-5 top-1/2 transform -translate-y-1/2 w-5 aspect-square"
                  alt="Dropdown icon"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      router.push("/course");
                      setSelectedOption("Courses");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 border-b border-gray-100 text-left"
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => {
                      router.push("/about");
                      setSelectedOption("About");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 border-b border-gray-100 text-left"
                  >
                    About
                  </button>
                  <button
                    onClick={() => {
                      router.push("/contact");
                      setSelectedOption("Contact");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 text-left"
                  >
                    Contact
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-10">
          <div className="flex gap-8 items-center font-base">
            <Link href="/subscriptions" className="hover:text-orange-600 whitespace-nowrap">
              Subscriptions
            </Link>
            <Link href="/about" className="hover:text-orange-600 whitespace-nowrap">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-orange-600 whitespace-nowrap">
              Contact Us
            </Link>
          </div>

          <div className="flex gap-4 items-center text-base">
            <button
              onClick={() => {
                handleOpenCart();
              }}
              className="relative"
            >
              <ShoppingCart className="w-7 h-7 text-base" />
              {items.length > 0 && (
                <div className="absolute -top-3 -right-3 text-xs py-1 px-2 rounded-full bg-blue-200">
                  {items.length}
                </div>
              )}
            </button>
            {isLoggedIn ? (
              <div
                ref={dropdownRef}
                className="flex items-center gap-4 cursor-pointer relative"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={isValidProfilePicture(profilePicture) ? profilePicture : "/assets/default-avatar.jpg"}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{`${(user as IUser).firstName} ${(user as IUser).lastName
                      }`}</span>
                    <span className="text-xs font-light text-gray-500">{`${toTitleCase((user as IUser).role)}`}</span>
                  </div>
                </div>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-16 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-56 z-[99999]">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{`${(user as IUser).firstName} ${(user as IUser).lastName
                        }`}</p>
                      <p className="text-xs text-gray-500">{`${toTitleCase((user as IUser).role)}`}</p>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="overflow-hidden gap-1.5 px-5 py-0.5 hover:bg-amber-500 hover:text-white hover:border-1 hover:border-gray-400 bg-white border border-solid border-zinc-200 min-h-[52px] rounded-[56px] whitespace-nowrap">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-white transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 space-y-6 mt-4">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between">
            <a href="/" onClick={() => setIsMenuOpen(false)}>
              <img src="/img/logo.svg" className="object-contain aspect-[4.22] w-[241px]" alt="Logo" />
            </a>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-900">
              <X size={24} />
            </button>
          </div>

          {/* Search and Courses in Mobile Menu */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start px-6 py-4 w-full bg-white border border-solid border-zinc-200 rounded-[66px] relative">
              <div className="flex gap-2 justify-center items-center w-full">
                <img src="/img/search.svg" className="object-contain w-5 aspect-square" alt="Search icon" />
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full border-none focus:outline-none text-sm placeholder-gray-500 bg-transparent"
                  value={mobileSearchQuery}
                  onChange={(e) => {
                    setMobileSearchQuery(e.target.value);
                    setShowMobileSearchDropdown(true);
                  }}
                  onFocus={() => setShowMobileSearchDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleMobileSearch();
                  }}
                />
              </div>
              {/* Search Dropdown (Mobile) */}
              {showMobileSearchDropdown && (mobileSearchQuery.trim() || isCoursesLoading) && (
                <div
                  ref={mobileSearchDropdownRef}
                  className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto"
                  style={{ minWidth: 0 }}
                >
                  {isCoursesLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading courses...</div>
                  ) : filteredMobileCourses.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {filteredMobileCourses.map((course) => (
                        <li key={course._id}>
                          <Link
                            href={`/course/${course._id}`}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowMobileSearchDropdown(false)}
                          >
                            <img
                              // src={course.coverImageUrl || "/img/Course/Course.png"}
                              src={"/img/Course/Course.png"}
                              alt={course.title}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-gray-900">{course.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found.</div>
                  )}
                </div>
              )}
            </div>

            <div className="relative w-full">
              <div
                onClick={() => setIsDropdownOpenMobile(!isDropdownOpenMobile)}
                className="w-full appearance-none flex flex-row items-center px-5 py-3 text-lg text-orange-500 bg-white border border-orange-500 border-solid min-h-[52px] rounded-[58px] cursor-pointer"
              >
                {selectedOption}
                <img
                  src="/img/downarrow.svg"
                  className="pointer-events-none absolute right-5 top-1/2 transform -translate-y-1/2 w-5 aspect-square"
                  alt="Dropdown icon"
                />
              </div>
              {isDropdownOpenMobile && (
                <div className="absolute left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      router.push("/course");
                      setSelectedOption("Courses");
                      setIsDropdownOpenMobile(false);
                      setIsMenuOpen(false); // Also close mobile menu
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 text-lg"
                  >
                    Courses
                  </button>
                  <button
                    onClick={() => {
                      router.push("/about");
                      setSelectedOption("About");
                      setIsDropdownOpenMobile(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 text-lg"
                  >
                    About
                  </button>
                  <button
                    onClick={() => {
                      router.push("/contact");
                      setSelectedOption("Contact");
                      setIsDropdownOpenMobile(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-lg"
                  >
                    Contact
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 text-lg">
            <a href="/" className="p-2 hover:bg-gray-100 rounded">
              Home
            </a>
            <a href="/about" className="p-2 hover:bg-gray-100 rounded">
              About
            </a>
            <a href="/contact" className="p-2 hover:bg-gray-100 rounded">
              Contact Us
            </a>
            <a href="/subscriptions" className="p-2 hover:bg-gray-100 rounded">
              Subscriptions
            </a>
          </div>

          {!isLoggedIn && (
            <Link href="/login">
              <button className="w-full px-2 py-1 bg-white border border-solid border-zinc-200 rounded-[56px] mt-4">
                Login
              </button>
            </Link>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-3 p-2">
              {isValidProfilePicture(profilePicture) ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={profilePicture} alt="Profile" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <span className="text-lg font-medium">{`${(user as IUser).firstName} ${(user as IUser).lastName}`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#0A141980]/50 backdrop-brightness-50 backdrop-blur-[2px]"
          onClick={handleCloseCart}
        />

        {/* Cart Panel */}
        <div
          className={`fixed right-0 top-0 h-screen w-full md:w-[90%] lg:w-[40%] transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <Cart />
        </div>
      </div>
    </nav>
  );
};
