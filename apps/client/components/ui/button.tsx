import { twMerge } from "tailwind-merge";

interface ButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
  variant: "primary" | "outline" | "ghost" | "destructive";
  size: "sm" | "md" | "lg";
  icon?: SVGElement;
}

export default function Button({
  label,
  onClick,
  className,
  icon,
  variant,
  size,
}: ButtonProps) {
  const variantStyles = {
    primary:
      "bg-zinc-700 hover:bg-zinc-800 text-white font-semibold rounded-lg",
    outline:
      "border-2 border-zinc-900 hover:bg-zinc-900 text-black hover:text-white transistion-all duration-300 rounded-full font-semibold",
    ghost: "text-black font-medium ",
    destructive:
      "bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-7 py-3.5 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={twMerge(
        `${variantStyles[variant]} ${sizeStyles[size]}`,
        className,
      )}
    >
      {icon}
      {label}
    </button>
  );
}
