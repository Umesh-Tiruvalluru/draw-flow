import Image from "next/image";
import { FaShapes } from "react-icons/fa6";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 ">
      {/* <FaShapes className="w-8 h-8 text-indigo-600" />
      <span className="text-2xl font-caveat font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        DrawFlow
      </span> */}
      <Image src="/logo.svg" width={120} height={120} alt="logo" />
    </div>
  );
}
