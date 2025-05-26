import { StarRating } from "./StarRating";

export const ReviewSection = () => {
  return (
    <section className="my-12 max-md:mt-10 ml-auto max-[1340px]:mx-4">
      <div className="flex gap-2 items-center text-3xl font-bold text-neutral-900">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/753eba6e3988ee6a19d3061d4b4af2a32cfedd01?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
          alt="Rating icon"
          className="object-contain shrink-0 self-stretch my-auto w-7 aspect-square"
        />
        <h2 className="self-stretch my-auto max-md:max-w-full">4.6 course rating - 22K ratings</h2>
      </div>

      <div className="grid grid-cols-2 gap-5 mt-12 max-w-full w-[720px] max-md:grid-cols-1 max-md:mt-10">
        {[1, 2, 3, 4].map((index) => (
          <article key={index} className="flex flex-col w-full max-md:mt-10">
            <div className="flex flex-col w-full">
              <div className="flex gap-4 items-center self-start">
                <img
                  src={
                    index % 2 === 0
                      ? "https://cdn.builder.io/api/v1/image/assets/TEMP/e59055240468080ad8f90a1ba9f520e47a9834de?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                      : "https://cdn.builder.io/api/v1/image/assets/TEMP/4146b3ab3af94fb6d649217178bee4654f1b0132?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                  }
                  alt="User avatar"
                  className="object-contain shrink-0 self-stretch my-auto w-11 rounded-full aspect-square"
                />
                <div className="self-stretch my-auto w-48">
                  <h3 className="text-lg font-medium text-neutral-900">{index % 2 === 0 ? "Tushar S." : "Belle R."}</h3>
                  <div className="flex gap-3 items-start mt-1.5 w-full">
                    <StarRating rating={4.5} />
                    <span className="text-base text-gray-500">2 weeks ago</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-base font-medium leading-6 text-neutral-900">
                {index % 2 === 0
                  ? "At 25 years old, my favorite compliment is being told that I look like my mom. Seeing myself in her image."
                  : "At first, I was overwhelmed by the projects. But by the end of the basic training, I was all set and ready to go."}
                {index % 2 !== 0 && <button className="text-sky-500 underline">Show more</button>}
              </p>
            </div>

            <div className="flex gap-5 items-center self-start mt-6">
              <span className="self-stretch my-auto text-base text-gray-500">Helpful?</span>
              <div className="flex gap-4 items-center self-stretch my-auto">
                <button>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/824346f56cd31539d92091d40a3810a3aaa9441c?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                    alt="Thumbs up"
                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[21px]"
                  />
                </button>
                <button>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/69eb464741ffe62d2f00abc29c1f7bff05007f13?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
                    alt="Thumbs down"
                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[21px]"
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
