import * as React from "react";

export function CourseDurationSection() {
  return (
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
  );
}
