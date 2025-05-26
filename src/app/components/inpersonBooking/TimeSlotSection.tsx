import * as React from "react";

export function TimeSlotSection() {
  return (
    <section className="flex flex-wrap gap-5 justify-between mt-5 max-w-full text-neutral-900 w-[667px]">
      <h2 className="self-start text-2xl font-bold">Choose Time Slot(s):</h2>
      <div className="flex flex-col justify-center text-lg">
        <div>
          <div className="flex gap-3 items-end">
            <div className="flex gap-2.5 items-center min-w-60">
              <p className="self-stretch my-auto">Morning Slot:</p>
              <p className="self-stretch my-auto font-bold">
                8:00 AM – 12:00 PM
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-end mt-3">
            <div className="flex gap-2.5 items-center min-w-60">
              <p className="self-stretch my-auto">Afternoon Slot:</p>
              <p className="self-stretch my-auto font-bold">
                1:00 PM – 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
