import { BiCircle, BiPencil, BiRectangle } from "react-icons/bi";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import IconButton from "./IconButton";
import { Tool } from "@/types";
import { FaHand } from "react-icons/fa6";

interface TopbarProps {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}

export default function Topbar({ selectedTool, setSelectedTool }: TopbarProps) {
  return (
    <div className="absolute flex items-center gap-2 w-fit p-4 h-[50px] bg-white top-5 left-0 right-0 mx-auto rounded-xl">
      <IconButton
        active={selectedTool === "PAN"}
        onClick={() => {
          setSelectedTool("PAN");
        }}
        icon={<FaHand />}
      />

      <IconButton
        active={selectedTool === "RECT"}
        onClick={() => {
          setSelectedTool("RECT");
        }}
        icon={<BiRectangle />}
      />
      <IconButton
        active={selectedTool === "CIRCLE"}
        onClick={() => {
          setSelectedTool("CIRCLE");
        }}
        icon={<BiCircle />}
      />
      <IconButton
        active={selectedTool === "LINE"}
        onClick={() => {
          setSelectedTool("LINE");
        }}
        icon={<TfiLayoutLineSolid />}
      />
      <IconButton
        active={selectedTool === "PENCIL"}
        onClick={() => {
          setSelectedTool("PENCIL");
        }}
        icon={<BiPencil />}
      />
    </div>
  );
}
