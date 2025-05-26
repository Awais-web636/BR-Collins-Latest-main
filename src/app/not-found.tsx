"use client";

import NotFoundImage from "../../public/assets/notFound.svg";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/app/utils/axios";
import { ICourse } from "@/app/types/course.contract";

const PAGES = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "Terms & Conditions", path: "/terms" },
  { title: "Privacy Policy", path: "/privacy" },
  { title: "Subscriptions", path: "/subscriptions" },
  { title: "Success", path: "/success" },
];

export default function NotFound() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    setLoadingCourses(true);
    api
      .get("/courses?showBlocked=false")
      .then((res) => {
        // Some APIs return { data: [...] }, some just [...], so check
        const apiCourses = res.data?.data || res.data;
        // Assgin random rating to each course which don't have rating
        const coursesWithRating = apiCourses.map((course: ICourse) => ({
          ...course,
          rating: (course.rating || Math.random() * (5 - 3) + 3).toFixed(1),
          noOfStudents: (course.noOfStudents || Math.floor(Math.random() * (1000 - 1) + 1)).toFixed(0),
        }));
        setCourses(coursesWithRating);
        setLoadingCourses(false);
      })
      .catch(() => setLoadingCourses(false));
  }, []);

  const handleSearch = () => {
    if (search.trim() === "") {
      setResults([]);
      return;
    }
    const q = search.trim().toLowerCase();
    const pageResults = PAGES.filter((p) => p.title.toLowerCase().includes(q));
    const courseResults = courses.filter((c) => c.title.toLowerCase().includes(q));

    setResults([
      ...(pageResults.length > 0 ? [{ type: "Pages", items: pageResults }] : []),
      ...(courseResults.length > 0 ? [{ type: "Courses", items: courseResults }] : []),
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full min-h-[80vh] flex items-center justify-center text-center bg-[#F3F6F8] px-4">
      <div className="w-full max-w-7xl flex flex-col-reverse lg:flex-row justify-between items-center gap-10 py-12">
        {/* Left Content */}
        <div className="w-full flex flex-col justify-center items-start gap-5 text-start">
          <h1 className="text-4xl md:text-5xl font-bold text-black">404 Not Found</h1>
          <h3 className="text-base md:text-lg text-gray-700 max-w-lg">
            We couldn't find the page you requested. It may have been moved or deleted.
          </h3>
          <Link
            href="/"
            className="w-full sm:w-fit px-6 py-2 rounded-full border border-primary bg-primary text-white text-sm md:text-md hover:bg-primary-hover transition"
          >
            Return to Home
          </Link>

          <p className="text-black font-semibold text-md">Or try searching instead</p>

          <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[80%] xl:w-[65%] flex items-center bg-white rounded-full px-4 py-2 shadow-sm gap-2">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search..."
              className="p-2 w-full outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch();
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-hover transition text-white"
              aria-label="Search"
            >
              <Search size={20} className="" />
            </button>
          </div>
          {loadingCourses && (
            <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[80%] xl:w-[65%] mt-2 text-left text-gray-600 text-sm bg-white rounded-lg p-3 shadow">
              Loading courses...
            </div>
          )}
          {results.length > 0 && (
            <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[80%] xl:w-[65%] mt-2 text-left text-gray-600 text-sm bg-white rounded-lg p-3 shadow flex flex-col gap-4">
              {results.map((section, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-black mb-2">{section.type}</div>
                  <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2">
                    {section.items.map((item: any, i: number) => (
                      <li key={i}>
                        {section.type === "Courses" ? (
                          <Link
                            href={`/course/${item._id}`}
                            className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition"
                          >
                            {(item.coverImageUrl || item.imageUrl) && (
                              <img
                                src={"/img/Course/Course.png"}
                                alt={item.title}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        ) : (
                          <Link href={item.path} className="hover:bg-gray-100 rounded px-2 py-1 transition">
                            {item.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {results.length === 0 && search.trim() !== "" && !loadingCourses && (
            <div className="w-full sm:w-[70%] md:w-[60%] lg:w-[80%] xl:w-[65%] mt-2 text-left text-gray-600 text-sm bg-white rounded-lg p-3 shadow">
              No results found for "{search}".
            </div>
          )}
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2">
          <Image
            src={NotFoundImage}
            alt="not_found"
            width={600}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
