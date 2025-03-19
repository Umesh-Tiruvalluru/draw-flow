import { ReactNode } from "react";
import { Sidebar } from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-full flex realtive">
      <Sidebar />
      <div className="h-full w-full">
        <Navbar />
        {children}
      </div>
    </main>
  );
}
