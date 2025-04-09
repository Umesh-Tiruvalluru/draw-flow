"use client";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { deleteBoard } from "@/service";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";

type Room = {
  id: number;
  slug: string;
  imageId: number;
  isFavourite: boolean;
  created_at: Date;
};

export default function BoardCard({
  id,
  slug,
  imageId,
  isFavourite,
  created_at,
}: Room) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState(isFavourite);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState(false);

  const handleDropDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setClicked(!clicked);
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      console.log(id);
      await deleteBoard(id);
      setModal(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFavorite: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Add API call to update favorite status
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Modal close={modal} setClose={() => setModal(false)}>
        <h1>Are you sure you want to delete this room?</h1>
        <Button
          label="Delete Board"
          size="md"
          variant="destructive"
          className="float-right"
          onClick={() => handleDelete(id)}
        />
      </Modal>
      <Link href={`canvas/${id}`} className="block">
        <div className="group aspect-[100/127] border rounded-xl flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative flex-1 bg-amber-50">
            <Image
              src={`/placeholders/${imageId}.svg`}
              fill
              className="object-fit"
              alt={slug}
            />
            <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black" />
            <button
              className="absolute top-4 right-3 p-1 rounded-full hover:bg-white/30 transition-colors"
              onClick={handleDropDown}
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={clicked}
            >
              <BsThreeDotsVertical className="text-zinc-500" size={18} />
            </button>

            {clicked && (
              <div
                ref={dropdownRef}
                className="absolute top-12 right-3 bg-white rounded-md shadow-lg p-2 z-10 w-32"
              >
                <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">
                  Edit
                </button>
                <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm">
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setModal(true);
                    setClicked(false);
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="relative bg-white p-3">
            <p className="text-[13px] truncate max-w-[calc(100%-20px)] font-medium">
              {slug}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(created_at, { addSuffix: true })}
            </p>
            <button
              className="absolute top-3 right-3"
              onClick={toggleFavorite}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <FaStar className="text-yellow-500 fill-current" size={20} />
              ) : (
                <CiStar size={20} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
}
