interface InstructorSectionProps {
  instructor: {
    name: string;
    imageUrl?: string;
    description?: string;
  };
}
export const InstructorSection = ({ instructor }: InstructorSectionProps) => {
  return (
    <section className="mt-10 ml-auto max-[1340px]:mx-4">
      <h2 className="text-3xl font-bold text-neutral-900">Instructors</h2>

      <div className="flex gap-10 mt-8">
        <img
          src={
            instructor.imageUrl ||
            "https://cdn.builder.io/api/v1/image/assets/TEMP/6ee5ca926bddc2d0c55393998d02919c28fece12?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
          }
          alt={instructor.name}
          className="object-contain shrink-0 self-start max-w-full rounded-full aspect-square w-[140px]"
        />

        <div>
          <div className="flex flex-col justify-center w-full">
            <h3 className="text-2xl font-semibold text-neutral-900">{instructor.name}</h3>
            <p className="mt-1.5 text-base text-gray-500">{instructor.description || "Senior Creative Manager"}</p>
          </div>

          <hr className="mt-4 w-full border border-gray-200/50 border-solid h-px" />

          <div className="flex flex-col mt-4 w-full">
            <div className="flex gap-2 items-center w-full">
              <span className="self-stretch my-auto text-lg font-medium text-neutral-900">4.8</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a6975645ac39eda75d40a94cf7cca560ed9f51e?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt="Full star"
              />
              <a href="#" className="self-stretch my-auto text-base underline text-neutral-900">
                215,475 Reviews
              </a>
            </div>

            <div className="self-start mt-2.5 text-base text-neutral-900">
              <div className="flex gap-2 items-center max-w-full ">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d9b645b75e3aaba0998717c0266b4b378f3b13a?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                  alt="Courses icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-[1.46] w-[19px]"
                />
                <span>276 Courses</span>
              </div>
              <div className="flex gap-2 items-center mt-2.5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2da4145c7bc44e70df355cbb06cf2f020433498e?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                  alt="Students icon"
                  className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                />
                <span>3,176,106 Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-base leading-7 text-neutral-900 w-[706px] max-md:max-w-full">
        <em className="font-medium">
          With over 15 years of experience in administrative operations, Karen has worked with Fortune 500 companies and
          small businesses alike,
        </em>{" "}
        optimizing their office workflows and training admin teams for peak performance. Her expertise lies in workplace
        communication, time management, and streamlining processes. Karen brings real-world insights to every lesson,
        making learning relatable and practical.
      </p>

      {/* <button className="mt-5 text-base font-semibold text-sky-500 underline">Show more</button> */}
    </section>
  );
};
