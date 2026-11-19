export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-8 w-56" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="skeleton h-64" />
      <div className="skeleton h-40" />
    </div>
  );
}