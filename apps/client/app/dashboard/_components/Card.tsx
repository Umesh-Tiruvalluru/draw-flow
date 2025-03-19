import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { BiStar } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { GrFavorite } from "react-icons/gr";

type room = {
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
}: room) {
  return (
    <Link href={`canvas/${id}`}>
      <div className="group aspect-[100/127] border rounded-xl flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={`/placeholders/${imageId}.svg`}
            fill
            className="object-fit"
            alt={slug}
          />
          <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black" />
        </div>
        <div className="relative bg-white p-3">
          <p className="text-[13px] truncate max-w-[calc(100% - 20px)]">
            {slug}
          </p>
          <p>{formatDistanceToNow(created_at, { addSuffix: true })}</p>
          <button className="absolute top-3 right-3">
            <FaStar className="text-red-500 fill-current " size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
}
