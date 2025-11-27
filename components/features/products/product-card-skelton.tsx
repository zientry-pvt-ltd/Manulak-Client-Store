type ProductCardSkeletonProps = {
  isLoading: boolean;
};

export function ProductCardSkeleton({ isLoading }: ProductCardSkeletonProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-lg border p-4 flex flex-col gap-4 bg-gray-100"
        >
          <div className="h-40 bg-gray-300 rounded-md" />
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-300 rounded w-1/3 mt-2" />
        </div>
      ))}
    </>
  );
}
