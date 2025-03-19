"use client";
interface ButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
  variant: "primary" | "outline";
  size: "sm" | "md" | "lg";
  icon?: string;
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
      "bg-zinc-800 hover:bg-zinc-900 text-white font-semibold min-w-[150px] rounded-full",
    outline:
      "border-2 border-zinc-900 hover:bg-zinc-900 min-w-[150px] text-black hover:text-white transistion-all duration-300 rounded-full font-semibold",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-7 py-3.5",
  };

  return (
    <button
      onClick={onClick}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
