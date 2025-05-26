import React from "react";

function Pagination() {
  return (
    <div className="flex flex-col justify-center px-6 py-2.5 mt-7 w-full rounded-lg bg-slate-100 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <p className="self-stretch my-auto text-base font-medium text-center text-gray-500 uppercase">
          Page 1 of 7
        </p>
        <div className="flex gap-10 items-center self-stretch my-auto">
          <button aria-label="Previous page">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f402b839af9badb703ea3ca29c140df1e6574769?placeholderIfAbsent=true"
              alt="Previous page"
              className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            />
          </button>
          <button aria-label="Next page">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/88ab2f20417d1708b7df9a0ca1da04512bc7cb46?placeholderIfAbsent=true"
              alt="Next page"
              className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
