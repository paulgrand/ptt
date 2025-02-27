"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location || !startDate || !endDate) {
      alert("Please fill in all fields");
      return;
    }
    router.push(`/results/${location}/${startDate}/${endDate}`);
  };

  // return (
    // <div className="p-6 max-w-md mx-auto">
    //   <form onSubmit={handleSearch} className="space-y-4">
    //     <div>
    //       <label className="block text-sm font-medium">Location</label>
    //       <input
    //         type="text"
    //         placeholder="Enter location"
    //         value={location}
    //         onChange={(e) => setLocation(e.target.value)}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium">Start Date</label>
    //       <input
    //         type="date"
    //         value={startDate}
    //         onChange={(e) => setStartDate(e.target.value)}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium">End Date</label>
    //       <input
    //         type="date"
    //         value={endDate}
    //         onChange={(e) => setEndDate(e.target.value)}
    //         className="w-full p-2 border rounded"
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="w-full bg-blue-500 text-white p-2 rounded"
    //     >
    //       Search
    //     </button>
    //   </form>
    // </div>
  // );
}