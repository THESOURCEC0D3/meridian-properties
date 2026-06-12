export default function PropertiesLoading() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
