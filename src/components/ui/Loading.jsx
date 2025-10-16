import { cn } from "@/utils/cn";

const Loading = ({ className, type = "cards", count = 6 }) => {
  if (type === "board-detail") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 shimmer">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-200 rounded w-24 shimmer"></div>
          <div className="h-10 bg-gray-200 rounded w-32 shimmer"></div>
          <div className="h-10 bg-gray-200 rounded w-28 shimmer"></div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-card border shimmer">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "post-detail") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="bg-white rounded-lg p-8 shadow-card border shimmer">
          <div className="flex gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-8 shadow-card border shimmer">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-card border shimmer"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;