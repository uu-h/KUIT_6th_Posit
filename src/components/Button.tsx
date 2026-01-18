type ButtonVariant = "primary" | "outline";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  fullWidth = true,
}: ButtonProps) {
  const baseStyle = `
    h-[51px]
    rounded-[8px]
    flex items-center justify-center
    typo-16-bold
    transition-colors
  `;

  const widthStyle = fullWidth ? "w-full" : "w-fit";

  const variantStyle = disabled
    ? "bg-neutrals-04 text-neutrals-06 cursor-not-allowed"
    : variant === "primary"
    ? "bg-primary-01 text-corals-000 cursor-pointer"
    : "border border-primary-01 text-primary-01 bg-transparent cursor-pointer";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${widthStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
}
