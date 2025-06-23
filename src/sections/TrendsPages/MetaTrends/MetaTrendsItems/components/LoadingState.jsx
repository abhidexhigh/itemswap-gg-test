// components/LoadingState.jsx
import React, { memo } from "react";

export const LoadingState = memo(() => (
  <div className="mx-auto md:px-0 lg:px-0 py-6">
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D9A876]"></div>
    </div>
  </div>
));

// components/ErrorState.jsx
export const ErrorState = memo(({ error, onRetry }) => (
  <div className="mx-auto md:px-0 lg:px-0 py-6">
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-red-400 text-6xl">⚠️</div>
      <div className="text-red-400 text-lg font-medium">
        Failed to load data
      </div>
      <div className="text-gray-400 text-sm text-center max-w-md">
        {error}. Please check your internet connection and try again.
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[#2D2F37] hover:bg-[#3D3F47] text-[#D9A876] rounded-lg text-sm transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  </div>
));

export default { LoadingState, ErrorState };
