import ProfileIcon from "../../../assets/Owner/Posit/Profile.svg";

type ConcernReadonlyCardProps = {
  name: string;
  profile?: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
};

export default function ConcernReadonlyCard({
  name,
  title,
  content,
  date,
  imageUrl,
}: ConcernReadonlyCardProps) {

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);

    // 임시 수동 보정 (+18시간)
    d.setHours(d.getHours() + 18);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const hourStr = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} ${hourStr}:${minutes} ${ampm}`;
  };

  return (
    <div
      className="
        mt-[12px]
        mx-auto w-[343px]
        rounded-[16px]
        bg-corals-000
        p-[16px] pb-[42px]
        min-h-[350px]
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-[19px]">
          <img
            src={ProfileIcon}
            alt="profile"
            className="w-[56px] h-[56px]"
          />
          <div className="flex flex-col justify-center gap-[8px]">
            <p className="typo-14-semibold text-black">@{name}</p>
          </div>
        </div>
      </div>

      <div className="mt-[24px] flex flex-col gap-[16px]">
        <p className="typo-16-semibold text-black">{title}</p>
        <p className="typo-12-semibold text-neutrals-07">
          {formatDate(date)}
        </p>
      </div>

      <div className="h-[1px] bg-neutrals-05 mt-[16px] mb-[16px]" />

      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="answer"
            className="w-[311px] h-[232px] object-cover rounded-[8px]"
          />
        </div>
      )}

      <p className="pt-[16px] typo-14-regular text-black leading-[175%] whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
