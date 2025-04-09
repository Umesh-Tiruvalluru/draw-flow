"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import Button from "@/components/ui/button";
import { addRoom, getRooms } from "@/service";
import BoardCard from "./_components/Card";
import Modal from "@/components/ui/modal";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<[]>();
  const [close, setClose] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>("");

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
      setRooms(response.rooms);
    };

    fetchRooms();
  }, [rooms]);

  async function handleAddRoom() {
    const response = await addRoom(slug);
    console.log(response);

    setClose(false);
  }

  if (isLoading) return <Loading />;

  return (
    <div className="px-6 pt-10">
      <Modal close={close} setClose={() => setClose(false)}>
        <h1>Board Name</h1>
        <input
          type="text"
          name="fullName"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border border-zinc-300 rounded-lg py-3 px-4 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Enter your Board Name"
        />
        <Button
          label="Add Board"
          size="md"
          variant="primary"
          className="float-right"
          onClick={handleAddRoom}
        />
      </Modal>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold ">Boards</h1>
        <Button
          label="Add Board"
          variant="primary"
          size="md"
          onClick={() => setClose(true)}
          // icon={<FaPlus />}
        />
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 pb-10">
        {rooms?.map((room) => (
          <BoardCard
            key={room.id}
            id={room.id}
            slug={room.slug}
            isFavourite={room.isFavouriteq}
            created_at={room.created_at}
            imageId={room.imageId}
          />
        ))}
      </div>
    </div>
  );
}
