import Image from "next/image";

export function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Image
        src="/logo.svg"
        width={150}
        height={150}
        alt="logo"
        className="animate-pulse duration-700"
      />
    </div>
  );
}
