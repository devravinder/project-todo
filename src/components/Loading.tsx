
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 rounded ${className}`}
  />
);

const HeaderLoader = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
      </div>
    </header>
  );
};

const ColumnLoader = () => {
  return (
    <div className="flex flex-col shrink-0 w-80 rounded-lg border border-slate-300 bg-white">
      {/* Column header */}
      <div className="p-4 border-b border-slate-300">
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Cards */}
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3 border border-slate-300 rounded-lg space-y-2"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderLoader />

      <main className="w-full max-w-8xl mx-auto flex-1 overflow-hidden">
        <div className="w-full h-full overflow-auto flex p-8 justify-between">
          <ColumnLoader />
          <ColumnLoader />
          <ColumnLoader />
          <ColumnLoader />
        </div>
      </main>
    </div>
  );
}
