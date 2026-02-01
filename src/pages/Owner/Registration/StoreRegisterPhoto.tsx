import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

import PhotoPlusIcon from "../../../assets/Owner/Registration/PhotoPlus.svg";

export default function StoreRegisterPhoto() {
  const navigate = useNavigate();

  // 최대 5장
  const [photos, setPhotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  /* ---------------- 사진 선택 ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || currentIndex === null) return;

    const previewUrl = URL.createObjectURL(file);

    setPhotos((prev) => {
      const next = [...prev];
      next[currentIndex] = previewUrl;
      return next;
    });

    e.target.value = "";
    setCurrentIndex(null);
  };

  const uploadedCount = photos.filter(Boolean).length;
  const isValid = uploadedCount >= 3;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

        {/* Title + Step */}
        <div className="px-6 pt-0 mt-0 pb-6">
        <div className="flex items-center justify-between">
            <h1 className="typo-sub-title">
            가게 사진을 추가해주세요.
            </h1>

        {/* Step Pill */}
            <div className="w-[43px] h-[23px] rounded-full bg-neutrals-02 flex items-center justify-center shrink-0">
            <span className="typo-14-medium">2</span>
            <span className="typo-14-medium text-neutrals-06">/4</span>
            </div>
        </div>

        <p className="mt-2 typo-12-regular text-neutrals-07">
            외관, 내부, 메뉴 사진 등을 추천해요. (최소 3장, 최대 5장)
        </p>
        </div>


      {/* Content */}
      <div className="flex-1 px-6">
        <p className="typo-14-medium mb-2">첨부파일</p>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                fileInputRef.current?.click();
              }}
              className="w-[111px] h-[111px] aspect-square rounded-lg border border-neutrals-04 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {photo ? (
                <img
                  src={photo}
                  alt={`사진 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={PhotoPlusIcon}
                  alt="사진 추가"
                  className="w-[32px] h-[32px] opacity-40"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4">
        <Button
          height="h-[48px]"
          disabled={!isValid}
          onClick={() => navigate("/owner/store/register/hours")}
        >
          완료
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
