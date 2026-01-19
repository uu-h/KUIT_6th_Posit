type DividerProps = {
  className?: string;
};

export default function Divider({ className = "" }: DividerProps) {
  return (
    <div className={["h-[1px] w-full bg-[#C2C2C2]", className].join(" ")} />
  );
}
