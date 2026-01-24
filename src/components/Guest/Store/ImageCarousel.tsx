export default function ImageCarousel({ images }: { images: string[] }) {
  if (!images?.length) return null;

  return (
    <div className="mt-[23px] -mx-4 pl-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-[10px] w-max pb-[4px]">
        {images.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="w-[121px] h-[121px] rounded-[10.5px] bg-neutrals-02 overflow-hidden shrink-0"
          >
            <img
              src={src}
              alt={`가게 이미지 ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
