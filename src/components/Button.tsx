type ButtonVariant = "primary" | "outline";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  height?: string; // 추가
};

export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  fullWidth = true,
  height = "h-[51px]", // 기본값
}: ButtonProps) {
  const baseStyle = `
    ${height}
    rounded-[8px]
    flex items-center justify-center
    typo-16-bold
    transition-colors
  `;

  const widthStyle = fullWidth ? "w-full" : "";

  const variantStyle = disabled
    ? "bg-neutrals-03 text-white cursor-not-allowed"
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
