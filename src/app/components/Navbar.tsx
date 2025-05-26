"use client";
import { useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import colors from "../../../public/assets/colors/colors";
import Link from "next/link";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-900 py-[6px] lg:px-[120px] md:px-[50px] sm:px-[20px] px-[20px]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-sm">
            <p className="font-bold text-orange-500">B.R. COLLINS</p>
            <p className="text-xs text-blue-600 tracking-wide">
              TRAINING GROUP
            </p>
          </div>
        </div>

        <div className="items-center gap-2 hidden lg:flex 2xl:w-[550px] xl:w-[470px] lg:w-[400px] lg:mr-5 md:w-[370px] md:mr-6">
          <div className="rounded-full border-1 md:h-[40px] md:w-60 w-50 h-[20px] flex">
            <Search
              className="mx-3 my-1.5 "
              style={{ fontSize: "13px", color: 'black' }}
            />

            <input
              type="text"
              placeholder="Search for anything"
              className="outline-none text-sm w-full"
            />
          </div>
          <select
            name="Courses"
            className="border border-orange-400 text-orange-500 bg-transparent py-2 rounded-full text-sm md:h-[40px] h-[30px] w-32 md:w-25 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Courses</option>
            <option value="">Course 2</option>
            <option value="">Course 3</option>
            <option value="">Course 4</option>
          </select>
        </div>

        <div className="hidden lg:flex gap-2 items-center md:mr-5">
          <Link href={'/'} style={{ textDecoration: "none",color:colors.gray}} className="text-sm mx-1 text-gray-900">
            About
          </Link>
          <Link href={'/terms'} className="text-sm mx-1">
            Terms
          </Link>
          <Link href={"/privacy"}className="text-sm mx-1">
            Privacy
          </Link>
        </div>
        <div className="hidden lg:flex gap-1 items-center lg:m-5">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="hidden lg:flex gap-2 items-center">
          <button className="border px-4 py-1 rounded-full text-sm">
            Login
          </button>
        </div>

        <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden mt-3 space-y-2">
          <div className="items-center gap-2 flex w-100 lg:hidden">
            <input
              type="text"
              placeholder="Search for anything"
              className="border rounded-full px-4 py-3  text-sm w-50 h-[40px]"
            />
            <button className="border border-orange-400 text-orange-500 px-2 rounded-full w-30 h-[40px]">
              <select name="Courses" className="w-21" id="">
                <option value="">Courses</option>
                <option value="">Course 2</option>
                <option value="">Course 3</option>
                <option value="">Course 4</option>
              </select>
            </button>
          </div>
          <a href="#" className="block">
            About
          </a>
          <a href="#" className="block">
            Terms
          </a>
          <a href="#" className="block">
            Privacy
          </a>
          <div className="flex gap-3 items-center">
            <ShoppingCart className="w-5 h-5 block" />
            <button className="border px-4 py-1 rounded-full text-sm">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
