"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import Button from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { getRooms } from "@/service";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login"); // Redirect unauthenticated users
    } else {
      setIsLoading(false); // Allow access to the dashboard
    }
  }, [router]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await getRooms();
      console.log("response", response);
      setRooms(response);
    };

    fetchRooms();
  }, []);

  if (isLoading) return <Loading />;

  console.log(rooms);
  return (
    <div className="px-6 pt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Boards</h1>
        <Button
          label="Add Board"
          variant="primary"
          size="md"
          // icon={<FaPlus />}
        />
      </div>
    </div>
  );
}
