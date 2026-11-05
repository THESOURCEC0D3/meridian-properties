/**
 * Streaming fallback for the properties route.
 *
 * Two changes from the original: it uses the `slate` ramp rather than `gray`
 * (the rest of the site is built on slate, and mixing neutral ramps makes the
 * skeleton read as a different surface than the cards it stands in for), and it
 * mirrors the shape of a PropertyCard — image block, then text lines — instead
 * of a plain rectangle, so the swap to real content is not a jump.
 */
export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-64 rounded bg-slate-800 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-800 animate-pulse mt-3" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <span role="status" className="sr-only">
          Loading properties…
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="h-52 w-full bg-slate-200 animate-pulse" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-slate-200 animate-pulse" />
                <div className="h-6 w-1/3 rounded bg-slate-200 animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
