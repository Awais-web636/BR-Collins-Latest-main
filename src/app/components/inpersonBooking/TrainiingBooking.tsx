"use client";
import * as React from "react";
import { CalendarSection } from "./CalendarSection";
import { TimeSlotSection } from "./TimeSlotSection";
 
export default function TrainingBooking() {
  return (
    <main className="flex flex-col py-12 pr-5 pl-14 mx-auto w-full rounded-3xl bg-slate-100 max-md:pl-5 max-md:max-w-full">
      <h1 className="self-start text-4xl font-bold text-neutral-900 max-md:max-w-full">
        In-Person Training Booking
      </h1>
      {/* course duration session */}
      <section className="flex flex-wrap gap-10 mt-14 max-w-full text-neutral-900 w-[587px] max-md:mt-10">
      <h2 className="grow shrink self-start text-2xl font-bold w-[205px]">
        Choose Course Duration:
      </h2>
      <div className="flex flex-col flex-1 justify-center text-lg">
        <div className="flex gap-3 items-end">
          <div className="flex gap-2.5 items-center">
            <p className="self-stretch my-auto">Half-Day Course:</p>
            <p className="self-stretch my-auto font-bold">$1495</p>
          </div>
        </div>
        <div className="flex gap-3 items-end mt-3">
          <div className="flex gap-2.5 items-center">
            <p className="self-stretch my-auto">Full-Day Course:</p>
            <p className="self-stretch my-auto font-bold">$1995</p>
          </div>
        </div>
      </div>
    </section>
      <hr className="shrink-0 mt-5 h-px bg-white border border-solid border-zinc-200 max-md:max-w-full" />
      <CalendarSection />
      <hr className="shrink-0 mt-5 h-px bg-white border border-solid border-zinc-200 max-md:max-w-full" />
      <TimeSlotSection />
    </main>
  );
}
