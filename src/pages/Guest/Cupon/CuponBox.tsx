import React from "react";

export default function TypographyExample() {
  const classes = [
    "typo-title",
    "typo-sub-title",
    "typo-headline",
    "typo-24-semibold",
    "typo-20-medium",
    "typo-19-medium",
    "typo-19-regular",
    "typo-18-medium",
    "typo-17-medium",
    "typo-16-bold",
    "typo-16-semibold",
    "typo-16-medium",
    "typo-16-regular",
    "typo-16-light",
    "typo-15-semibold",
    "typo-15-medium",
    "typo-15-regular",
    "typo-14-semibold",
    "typo-14-medium",
    "typo-14-regular",
    "typo-13-semibold",
    "typo-13-medium",
    "typo-13-regular",
    "typo-12-semibold",
    "typo-12-medium",
    "typo-12-regular",
    "typo-12-light",
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Typography Test</h1>
      {classes.map((cls) => (
        <div key={cls} className="flex flex-col gap-1">
          <span className="text-gray-500">{cls}</span>
          <span className={cls}>The quick brown fox jumps over the lazy dog.</span>
          <hr className="border-t border-gray-300 mt-2" />
        </div>
      ))}
    </div>
  );
}
