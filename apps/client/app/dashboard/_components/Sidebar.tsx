import Logo from "@/components/ui/Logo";
import { GrFavorite } from "react-icons/gr";
import { HiViewBoards } from "react-icons/hi";

export function Sidebar() {
  return (
    <div className="h-screen pr-10 pl-4 py-6 w-[300px] bg-slate-100 border-r border-slate-300">
      <div className="pl-2">
        <Logo />
      </div>
      <div className="space-y-3 mt-8">
        <div className="flex items-center gap-2 text-zinc-600 text-lg font-semibold cursor-pointer px-3 py-3 rounded-md bg-zinc-200 hover:text-black">
          <HiViewBoards className="text-xl" size={18} />
          Boards
        </div>
        <div className="flex items-center gap-2 text-zinc-600 text-lg font-semibold px-3 py-3 rounded-md cursor-pointer hover:bg-zinc-200 hover:text-black">
          <GrFavorite className="text-xl" size={18} />
          Favourites
        </div>
      </div>
    </div>
  );
}
