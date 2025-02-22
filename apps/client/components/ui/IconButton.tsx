import { ReactElement } from "react";
import { IconType } from "react-icons";

interface IconButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactElement<IconType>;
}

export default function IconButton({ active, onClick, icon }: IconButtonProps) {
  return (
    <button
      className={`${active && "bg-zinc-300"} p-2 rounded hover:text-zinc-900 hover:bg-zinc-300 ${active ? "text-zinc-900" : "text-zinc-800"}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
