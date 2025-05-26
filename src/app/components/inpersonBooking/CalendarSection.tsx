import * as React from "react";

export function CalendarSection() {
  return (
    <section className="mt-5 mr-5 max-md:mr-2.5 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col text-neutral-900 max-md:mt-10">
            <h2 className="text-2xl font-bold">View Calendar & Select Date:</h2>
            <p className="self-start mt-3.5 text-base leading-6">Click on a date to see time slot availability.</p>
          </div>
        </div>
        <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex overflow-hidden flex-col grow justify-center py-1 mt-1.5 w-full text-center text-white bg-sky-500 rounded-xl rotate-[5.551115123125783e-17rad] max-md:mt-10">
            <div className="w-full h-[279px] rotate-[1.0130093179665765e-16rad]">
              <div className="flex gap-2 justify-center items-center px-6 py-3.5 max-w-full text-base font-bold min-h-11 w-[325px] max-md:px-5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/fa3a4bff700bf494adf8e669e70aeaf52ad71392?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                  alt="Previous month"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[19px]"
                />
                <h3 className="self-stretch my-auto rotate-[1.0130093179665765e-16rad] w-[222px]">April, 2025</h3>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/539df19e12b9a036b1a787fb3e2dab8d01f6249b?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                  alt="Next month"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[19px]"
                />
              </div>
              <hr className="mt-1.5 max-w-full border border-solid bg-stone-300 border-stone-300 min-h-px w-[325px]" />
              <div className="mt-1.5 w-full whitespace-nowrap h-[223px] max-w-[325px] rotate-[1.0130093179665765e-16rad]">
                <div className="flex gap-2 items-center px-6 py-1.5 w-full text-xs font-semibold tracking-wide leading-none uppercase min-h-[25px] max-md:px-5">
                  {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => (
                    <div
                      key={day}
                      className="gap-2 self-stretch px-1.5 py-0.5 my-auto w-8 min-h-[13px] rotate-[1.0130093179665765e-16rad]"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="w-full text-sm font-bold leading-none rotate-[1.0130093179665765e-16rad]">
                  {[
                    [1, 2, 3, 4, 5, 6, 7],
                    [8, 9, 10, 11, 12, 13, 14],
                    [15, 16, 17, 18, 19, 20, 21],
                    [22, 23, 24, 25, 26, 27, 28],
                    [29, 30, 31, 1, 1, 1, 1],
                  ].map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex gap-2 items-center py-1 pr-6 pl-6 w-full min-h-[39px] rotate-[1.0130093179665765e-16rad] max-md:px-5"
                    >
                      {week.map((day, dayIndex) => {
                        const isHighlighted = day === 16;
                        const isSelected = [3, 12, 13, 14, 18, 25, 26, 27].includes(day);
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`self-stretch px-2 my-auto ${
                              isHighlighted ? "bg-primary" : isSelected ? "bg-white bg-opacity-30" : ""
                            } ${
                              isHighlighted || isSelected ? "rounded-lg" : "p-2"
                            } min-h-[33px] rotate-[1.0130093179665765e-16rad] w-[33px] ${
                              weekIndex === 4 ? "font-medium" : ""
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
