import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";
import PhotoPlusIcon from "../../../assets/Owner/Registration/PhotoPlus.svg";
import CameraIcon from "../../../assets/Owner/Registration/Camera.svg"
import GalleryIcon from "../../../assets/Owner/Registration/Gallery.svg"
import CloseIcon from "../../../assets/Common/Close.svg"

export default function StoreRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- 전화번호 포맷 ---------------- */
  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    // 서울 (02)
    if (numbersOnly.startsWith("02")) {
      if (numbersOnly.length <= 2) return numbersOnly;
      if (numbersOnly.length <= 5)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
      if (numbersOnly.length <= 9)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 5)}-${numbersOnly.slice(5)}`;
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6, 10)}`;
    }

    // 휴대폰 / 지역번호
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 7)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    if (numbersOnly.length <= 11)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;

    return numbersOnly;
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 주소 (AddressSearch에서 전달받음)
  const address = location.state?.address;
  const zonecode = location.state?.zonecode;

  // 사진 등록 모달
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        title="가게 등록하기"
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

      {/* Title + Progress */}
      <div className="px-6 pt-2 pb-10 flex items-center justify-between">
        <h1 className="typo-sub-title">
          고객에게 소개할 가게 정보를<br />
          등록해주세요
        </h1>

        <div className="w-[43px] h-[23px] -mt-5 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
          <span className="typo-14-medium text-black">1</span>
          <span className="typo-14-medium text-neutrals-04">/4</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 space-y-5">
        {/* 가게 이름 */}
        <div>
          <label className="typo-14-medium">가게 이름</label>
          <input className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular" />
        </div>

        {/* 가게 전화번호 */}
        <div>
          <label className="typo-14-medium">가게 전화번호</label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            inputMode="numeric"
            className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular"
          />
        </div>

        {/* 가게 주소 */}
        <div>
          <label className="typo-14-medium">가게 주소</label>
          <div className="mt-2 flex gap-2">
            <input
              value={address ?? ""}
              readOnly
              className="flex-1 h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular"
            />
            <button
              type="button"
              onClick={() => navigate("/owner/store/address-search")}
              className="w-[88px] h-[41px] px-3 rounded-[4px] border border-primary-01 text-primary-01 typo-14-medium cursor-pointer"
            >
              주소 찾기
            </button>
          </div>
          <input className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular" />
        </div>

        {/* 가게 종류 */}
        <div>
          <label className="typo-14-medium">가게 종류</label>
          <div className="mt-2 flex gap-2">
            {["스터디 카페", "브런치 카페", "디저트 카페"].map((type) => {
              const isSelected = selectedType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`
                    px-3 h-[43px] rounded-[16px] border typo-14-medium transition-colors
                    ${
                      isSelected
                        ? "bg-[#FF7A6E] border-[#FF7A6E] text-white"
                        : "border-[#c5c5c5] text-neutrals-09 bg-white"
                    }
                  `}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* 가게 SNS 링크 */}
        <div>
          <label className="typo-14-medium">가게 SNS 링크</label>
          <input className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular" />
        </div>

        {/* 가게 소개 */}
        <div>
          <label className="typo-14-medium">가게 소개</label>
          <div className="relative mt-2">
            <textarea
              className="w-full h-[113px] rounded-lg border border-neutrals-04 px-3 py-2 typo-14-regular resize-none"
              maxLength={500}
            />
            <span className="absolute bottom-3 right-3 typo-12-regular text-[#868686]">
              500
            </span>
          </div>
        </div>

        {/* 메뉴 소개 */}
        <div className="space-y-4">
          <label className="typo-14-medium">메뉴 소개</label>

          {[1, 2, 3].map((num) => (
            <div key={num} className="space-y-2">
              <input
                className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular"
                placeholder={`${num}. 대표 메뉴명 (필수)`}
              />
              <input
                className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3 typo-14-regular"
                placeholder="대표 메뉴 가격 (필수)"
              />

              <div
                role="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="w-[111px] h-[111px] rounded-lg border border-neutrals-04 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={PhotoPlusIcon}
                  alt="사진 추가"
                  className="w-[32px] h-[32px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4">
        <Button height="h-[48px]">완료</Button>
      </div>

 
    {/* 사진 등록 모달 */}
    {isPhotoModalOpen && (
    <div className="fixed inset-0 z-50 flex justify-center">
        {/* Dim */}
        <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsPhotoModalOpen(false)}
        />

        {/* Bottom Sheet */}
        <div
        className="
            absolute bottom-0
            w-full max-w-[375px]
            bg-white
            rounded-t-[16px]
            px-6 pt-4 pb-6
            safe-bottom
        "
        >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <span className="typo-16-medium">사진 등록</span>
            <button
            type="button"
            onClick={() => setIsPhotoModalOpen(false)}
            className="cursor-pointer"
            >
            <img
                src={CloseIcon}
                alt="닫기"
                className="w-[16px] h-[16px]"
            />
            </button>

        </div>

        <div className="space-y-6">
        <button
            type="button"
            className="w-full flex items-center gap-4 typo-15-regular cursor-pointer"
        >
            <img
            src={CameraIcon}
            alt="카메라로 촬영"
            className="w-[24px] h-[24px]"
            />
            <span>카메라로 촬영하기</span>
        </button>

        <button
            type="button"
            className="w-full flex items-center gap-4 typo-15-regular cursor-pointer"
        >
            <img
            src={GalleryIcon}
            alt="앨범에서 선택"
            className="w-[24px] h-[24px]"
            />
            <span>앨범에서 선택하기</span>
        </button>
        </div>

        </div>
    </div>
    )}

    </div>
  );
}
