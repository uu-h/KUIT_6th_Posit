import InfoIcon from "../../../assets/Owner/Posit/InfoIcon.svg";

type InfoLineProps = {
  text: string;
  className?: string;
};

export default function InfoLine({ text, className = "" }: InfoLineProps) {
  return (
    <div className={["flex items-start gap-2", className].join(" ")}>
      <span className="w-[16px] h-[16px] flex items-center justify-center">
        <img src={InfoIcon} alt="안내정보" className="h-[13px]" />
      </span>
      <p className="text-neutrals-09 typo-12-regular whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
