import React from "react";

const TextSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl animate-pulse">
      <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
      <div className="w-[95%] h-3 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-3 bg-gray-300 rounded mb-2"></div>
      <div className="w-[95%] h-3 bg-gray-300 rounded mb-2"></div>
    </div>
  );
};

export default TextSkeleton;
