


export default function Loading() {
    return (
        <main className="min-h-screen bg-bbro-background p-10 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-12 bg-bbro-element-dark p-6 rounded-sm shadow-md opacity-50">
                <div>
                    <div className="h-10 w-64 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-700 rounded"></div>
                </div>
                <div className="h-12 w-40 bg-bbro-element-light/50 rounded-sm"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-sm shadow-sm border border-bbro-element-light/20 overflow-hidden h-64 flex flex-col">
                        <div className="bg-bbro-element-dark p-4 border-b border-bbro-element-light/50 h-16">
                            <div className="h-6 w-3/4 bg-gray-700 rounded"></div>
                        </div>
                        <div className="p-5 flex-grow space-y-3">
                            <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
