import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

import PhotoPlusIcon from "../../../assets/Owner/Registration/PhotoPlus.svg";
import CameraIcon from "../../../assets/Owner/Registration/Camera.svg";
import GalleryIcon from "../../../assets/Owner/Registration/Gallery.svg";
import CloseIcon from "../../../assets/Common/Close.svg";

export default function StoreRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- 필수 state ---------- */
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [intro, setIntro] = useState("");

  const [menuNames, setMenuNames] = useState(["", "", ""]);
  const [menuPrices, setMenuPrices] = useState(["", "", ""]);

  // 주소
  const address = location.state?.address;

  /* ---------- 사진 ---------- */
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [menuImages, setMenuImages] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

/* ---------- 전화번호 포맷 ---------- */
const formatPhoneNumber = (value: string) => {
  const rawNumbers = value.replace(/\D/g, "");

  // 서울(02)은 최대 10자리
  if (rawNumbers.startsWith("02")) {
    const numbersOnly = rawNumbers.slice(0, 10);

    if (numbersOnly.length <= 2) return numbersOnly;
    if (numbersOnly.length <= 5)
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
    if (numbersOnly.length <= 9)
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 5)}-${numbersOnly.slice(5)}`;

    return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
  }

  // 휴대폰 / 기타 지역번호는 최대 11자리
  const numbersOnly = rawNumbers.slice(0, 11);

  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 7)
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;

  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;
};


  /* ---------- 사진 선택 ---------- */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || currentMenuIndex === null) return;

    const previewUrl = URL.createObjectURL(file);

    setMenuImages((prev) => {
      const next = [...prev];
      next[currentMenuIndex] = previewUrl;
      return next;
    });

    setIsPhotoModalOpen(false);
    e.target.value = "";
  };

  /* ---------- 필수 입력 검증 ---------- */
  const isFormValid =
    storeName.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    address?.trim().length > 0 &&
    detailAddress.trim().length > 0 &&
    selectedType !== null &&
    intro.trim().length > 0 &&
    menuNames.every((name) => name.trim().length > 0) &&
    menuPrices.every((price) => price.trim().length > 0) &&
    menuImages.every((img) => img !== null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar
        title="가게 등록하기"
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

      {/* Title */}
      <div className="px-6 pt-2 pb-10 flex items-center justify-between">
        <h1 className="typo-sub-title">
          고객에게 소개할 가게 정보를
          <br />
          등록해주세요
        </h1>

        <div className="w-[43px] h-[23px] -mt-5 rounded-full bg-neutrals-02 flex items-center justify-center">
          <span className="typo-14-medium">1</span>
          <span className="typo-14-medium text-neutrals-06">/4</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-[90px]">
        {/* 가게 이름 */}
        <div>
          <label className="typo-14-medium">가게 이름</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="typo-14-medium">가게 전화번호</label>
          <input
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(formatPhoneNumber(e.target.value))
            }
            inputMode="numeric"
            className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
          />
        </div>

        {/* 주소 */}
        <div>
          <label className="typo-14-medium">가게 주소</label>
          <div className="mt-2 flex gap-2">
            <input
              value={address ?? ""}
              readOnly
              className="flex-1 h-[48px] rounded-lg border border-neutrals-04 px-3"
            />
            <button
              type="button"
              onClick={() => navigate("/owner/store/address-search")}
              className="w-[88px] h-[48px] rounded-[8px] bg-primary-01 text-corals-000"
            >
              주소 찾기
            </button>
          </div>
          <input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
          />
        </div>

        {/* 가게 종류 */}
        <div>
          <label className="typo-14-medium">가게 종류</label>
          <div className="mt-2 flex gap-2">
            {["스터디 카페", "브런치 카페", "디저트 카페"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 h-[43px] rounded-[8px] border ${
                  selectedType === type
                    ? "bg-[#FF7A6E] text-corals-000 border-[#FF7A6E]"
                    : "border-[#c5c5c5]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* SNS 링크 (선택) */}
        <div>
          <label className="typo-14-medium">가게 SNS 링크</label>
          <input className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3" />
        </div>

        {/* 가게 소개 */}
        <div>
          <label className="typo-14-medium">가게 소개</label>
          <div className="relative mt-2">
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              maxLength={49}
              className="w-full h-[113px] rounded-lg border border-neutrals-04 px-3 py-2 resize-none"
            />
            <span className="absolute bottom-4 right-3 text-12-regular">
              {intro.length}/50자
            </span>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="space-y-4">
          <label className="typo-14-medium">메뉴 소개</label>

          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <input
                value={menuNames[index]}
                onChange={(e) => {
                  const next = [...menuNames];
                  next[index] = e.target.value;
                  setMenuNames(next);
                }}
                placeholder={`${index + 1}. 대표 메뉴명`}
                className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
              />
              <input
                value={menuPrices[index]}
                onChange={(e) => {
                  const next = [...menuPrices];
                  next[index] = e.target.value;
                  setMenuPrices(next);
                }}
                placeholder="대표 메뉴 가격"
                className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
              />

              <div
                onClick={() => {
                  setCurrentMenuIndex(index);
                  setIsPhotoModalOpen(true);
                }}
                className="w-[111px] h-[111px] rounded-lg border border-neutrals-04 flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {menuImages[index] ? (
                  <img
                    src={menuImages[index]!}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={PhotoPlusIcon} className="w-[32px] h-[32px]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4">
        <Button
          height="h-[48px]"
          disabled={!isFormValid}
          onClick={() => navigate("/owner/store/register/photo")}
        >
          완료
        </Button>
      </div>

      {/* file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 사진 등록 모달 */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsPhotoModalOpen(false)}
          />
          <div className="absolute bottom-0 w-full max-w-[375px] bg-white rounded-t-[16px] px-6 pt-4 pb-6">
            <div className="flex items-center justify-between mb-6">
              <span className="typo-16-medium">사진 등록</span>
              <button onClick={() => setIsPhotoModalOpen(false)}>
                <img src={CloseIcon} className="w-[16px] h-[16px]" />
              </button>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center gap-4"
              >
                <img src={CameraIcon} className="w-[24px] h-[24px]" />
                <span>카메라로 촬영하기</span>
              </button>

              <button
                onClick={() => galleryInputRef.current?.click()}
                className="w-full flex items-center gap-4"
              >
                <img src={GalleryIcon} className="w-[24px] h-[24px]" />
                <span>앨범에서 선택하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
