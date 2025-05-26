"use client";
import React from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  className = "",
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex gap-px items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <img
          key={`full-${i}`}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a6975645ac39eda75d40a94cf7cca560ed9f51e?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
          alt="Full star"
        />
      ))}
      {hasHalfStar && (
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b581f8c90e72c4e934ddb38dd3ee08456485234?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[0.89]"
          alt="Half star"
        />
      )}
      {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <img
          key={`empty-${i}`}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b581f8c90e72c4e934ddb38dd3ee08456485234?placeholderIfAbsent=true&apiKey=5551d33fb4bb4e9e906ff9c9a5d07fe5"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-[0.89]"
          alt="Empty star"
        />
      ))}
    </div>
  );
};
