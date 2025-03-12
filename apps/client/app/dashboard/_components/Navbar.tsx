"use client";

import Avatar from "@/components/ui/avatar";
import { useState } from "react";

export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex items-center justify-between w-full border-b py-3 border-slate-200 px-6">
      <input
        type="text"
        name="fullName"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="border border-zinc-300 rounded-lg py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        placeholder="Enter your full name"
      />
      <Avatar />
    </div>
  );
}
