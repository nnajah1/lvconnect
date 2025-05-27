import { cn } from "@/lib/utils";

function Button({
  children,
  type = "button",
  className = "",
  variant = "default",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
}) {
  const baseStyles =
    "rounded-md font-semibold transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed";
    
  const sizeStyles = {
    sm: "py-2 px-4 text-sm",
    md: "py-2 px-6 text-base",
    lg: "py-3 px-8 text-lg",
  };

  const variantStyles = {
    default: "bg-[#2CA4DD] text-white hover:bg-[#2494c6] active:bg-[#2CA4DD]",
    outline:
      "border border-[#2CA4DD] text-[#2CA4DD] hover:bg-[#2CA4DD] hover:text-white active:bg-transparent active:text-[#2CA4DD]",
    ghost:
      "text-[#2CA4DD] hover:bg-[#e1f5fe] active:bg-[#e1f5fe]",
    verify: "bg-[#2CA4DD] text-white  disabled:bg-[#85bbd4]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}

export { Button }
