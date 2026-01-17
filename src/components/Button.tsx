type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        h-[51px]
        rounded-[8px]
        flex items-center justify-center
        typo-16-bold
        transition-colors
        ${
          disabled
            ? "bg-neutrals-04 text-neutrals-06 cursor-not-allowed"
            : "bg-primary-01 text-shades-01 cursor-pointer"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
