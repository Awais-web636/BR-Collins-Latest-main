import * as React from "react";
import { BookingState } from "./InPersonPopup";

interface BookingSummaryProps {
  bookingState: BookingState;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingState }) => {
  return (
    <div className="flex flex-col grow pt-7 pb-14 w-full text-lg bg-gray-300 rounded-3xl text-neutral-900">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/179dd092ac1215fe4beb3a0ff1267359fcb77bcb?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
        alt="Close"
        className="object-contain self-end mr-8 aspect-square w-[18px] max-md:mr-2.5"
      />
      <div className="flex flex-col px-6 mt-4 w-full max-md:px-5">
        <h2 className="self-start text-2xl font-bold">Details Overview</h2>
        <div className="mt-16 max-md:mt-10 max-md:mr-2">
          <div className="flex flex-col justify-center max-w-full min-h-[53px] w-[275px]">
            <p>Course Duration:</p>
            <p className="mt-1 font-bold text-right">
              {bookingState.courseDuration === "half-day" ? "Half-Day" : "Full-Day"}
            </p>
          </div>
          <hr className="mt-2 max-w-full bg-white border border-solid border-zinc-200 min-h-px w-[275px]" />

          <div className="flex flex-col justify-center mt-4 max-w-full min-h-[53px] w-[275px]">
            <p>Course Price:</p>
            <p className="mt-1 font-bold text-right">${bookingState.price}</p>
          </div>
          <hr className="mt-2 max-w-full bg-white border border-solid border-zinc-200 min-h-px w-[275px]" />

          <div className="flex flex-col justify-center mt-4 max-w-full min-h-[53px] w-[275px]">
            <p>Selected Date:</p>
            <p className="mt-1 font-bold text-right">{bookingState.selectedDate.toLocaleDateString()}</p>
          </div>
          <hr className="mt-4 max-w-full bg-white border border-solid border-zinc-200 min-h-px w-[275px]" />

          <div className="flex flex-col justify-center mt-1 max-w-full min-h-[53px] w-[275px]">
            <p>Selected Slot(s):</p>
            <p className="mt-1 font-bold text-left">{bookingState.selectedSlot}</p>
          </div>
        </div>

        <button className="flex overflow-hidden gap-1.5 justify-center items-center px-5 py-3 mt-22 font-medium text-white bg-primary min-h-[58px] rounded-[58px] max-md:px-5 max-md:mt-10">
          <span className="self-stretch my-auto">Proceed to Payment</span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0889cf0590565dbb9aabef07a57290e2c923c555?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
            alt="Arrow right"
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
          />
        </button>
      </div>
    </div>
  );
};
