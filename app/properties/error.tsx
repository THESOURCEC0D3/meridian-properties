"use client";

export default function PropertiesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">Unable to load properties</h2>
      <p className="text-gray-600 mb-4">
        Something went wrong. Please try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Try again
      </button>
    </div>
  );
}
