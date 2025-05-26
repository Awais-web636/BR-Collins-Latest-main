"use client";
import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Bell,
  Menu,
  Moon,
  Sun,
  X
} from "lucide-react";

import Image from "next/image";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const suggestions = [
    "React",
    "Node.js",
    "Design Patterns",
    "Data Structures",
  ];

  return (
    <header
      className={`sticky top-0 z-50 text-gray-900 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } border-b border-slate-300 shadow-md`}
    >
      {/* Main Header */}
      <div className={`sm-block lg:hidden flex flex-col items-center my-3`}>
        <Image
          src="/assets/logo.png"
          width={120}
          height={60}
          alt="Logo"
          className="h-8  w-auto"
        />
      </div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Hidden on mobile */}
          <div className="hidden md:block">
            <Image
              src="/assets/logo.png"
              width={120}
              height={60}
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Mobile Menu Button - Visible only on mobile */}

          {/* Search Bar - Always visible */}
          <div className="flex-1 mx-4 max-w-2xl">
            <div
              className={`flex items-center gap-2 px-4 py-2 border rounded-full ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything"
                className={`flex-1 bg-transparent outline-none ${
                  darkMode
                    ? "text-white placeholder-gray-400"
                    : "text-black placeholder-gray-500"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Search Suggestions */}
            {searchQuery.length > 0 && (
              <ul
                className={`absolute left-4 right-4 mt-2 z-10 border rounded-lg shadow-lg ${
                  darkMode
                    ? "bg-gray-800 text-white border-gray-600"
                    : "bg-white text-black border-gray-200"
                }`}
              >
                {suggestions
                  .filter((item) =>
                    item.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setSearchQuery(item)}
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-5 none h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Desktop Navigation Items - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {/* Courses Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCourses(!showCourses)}
                className="flex gap-2 items-center px-4 py-1.5 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800"
              >
                Courses{" "}
                <ChevronDown
                  className={`transition-transform ${
                    showCourses ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showCourses && (
                <ul className="absolute z-10 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Web Dev
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    AI & ML
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                    Marketing
                  </li>
                </ul>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex gap-6 font-medium">
              <a href="#" className="hover:text-orange-400">
                Subscriptions
              </a>
              <a href="#" className="hover:text-orange-400">
                About
              </a>
              <a href="#" className="hover:text-orange-400">
                Contact Us
              </a>
            </nav>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark:hover:text-gray-200 Dark Mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-400 dark:hover:text-gray-200" />
              ) : (
                <Moon className="text-gray-700 dark:hover:text-gray-200" />
              )}
            </button>

            {/* Notification */}
            <button
              aria-label="Notifications"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <Bell className="w-5 h-5 dark:hover:text-gray-200" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <Image
                src="/assets/profile.jpg"
                width={44}
                height={44}
                alt="Profile"
                className="rounded-full"
              />
              <div className="text-sm">
                <p className="font-semibold">Charlotte A.</p>
                <p className="text-gray-500 dark:text-gray-300">Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only shown when toggled */}
        {showMobileMenu && (
          <div
            className={`md:hidden mt-4 py-4 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Mobile Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/logo.png"
                width={120}
                height={60}
                alt="Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowCourses(!showCourses)}
                  className="flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span>Courses</span>
                  <ChevronDown
                    className={`transition-transform ${
                      showCourses ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showCourses && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Web Dev
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      AI & ML
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Marketing
                    </a>
                  </div>
                )}
              </div>

              <a
                href="#"
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Subscriptions
              </a>
              <a
                href="#"
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                About
              </a>
              <a
                href="#"
                className="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Contact Us
              </a>
            </nav>

            {/* Mobile Settings */}
            <div className="mt-6 pt-4 border-t flex items-center justify-between">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="text-yellow-400" />
                ) : (
                  <Moon className="text-gray-700" />
                )}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </div>

            {/* Mobile Profile */}
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Image
                src="/assets/profile.jpg"
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">Charlotte A.</p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Student
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
