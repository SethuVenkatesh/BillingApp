
const SkeletonLoader = () => {
    return (
        <div className="p-2 grid grid-cols-4 border-b-2 p-2">
            <div className="w-1/4 space-y-2 col-span-3">
                <div className="h-4 bg-gray-300 rounded  animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="w-1/2 col-span-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
