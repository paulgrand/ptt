"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold text-red-500">Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={reset} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Try Again
      </button>
    </div>
  );
}