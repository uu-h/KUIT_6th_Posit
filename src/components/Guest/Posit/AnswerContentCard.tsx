interface AnswerContentCardProps {
  content: string;
  title: string;
  createdAt: string;
  images?: string[];
}

export default function AnswerContentCard({
  title,
  content,
  createdAt,
  images = [],
}: AnswerContentCardProps) {

  //이미지 변환
  const S3_BASE = "https://posit-deploy.s3.ap-northeast-2.amazonaws.com/";

  //날짜 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const formattedHours = String(hours).padStart(2, "0");

    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col mt-[12px] p-[16px] gap-[8px] rounded-[8px] shadow-[0_0_8px_0_rgba(0,0,0,0.25)]">
      
      <div className="flex flex-col gap-[3px] border-b border-neutrals-05 pb-[3px]">
        <span className="typo-16-semibold">{title}</span>
        <span className="typo-12-semibold text-neutrals-07">
          {formatDate(createdAt)}
        </span>
      </div>

      {images.length > 0 && (
        <div className="flex flex-col gap-3">
          {images.map((url, index) => (
            <img
              key={index}
              src={`${S3_BASE}${url}`}
              alt=""
              className="m-[8px] rounded-[8px] object-cover"
            />
          ))}
        </div>
      )}

      <p className="typo-14-regular text-neutrals-09">{content}</p>
    </div>
  );
}
