import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPresignedUrl, uploadToS3 } from "../../../api/image";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

import PhotoPlusIcon from "../../../assets/Owner/Registration/PhotoPlus.svg";
import CameraIcon from "../../../assets/Owner/Registration/Camera.svg";
import GalleryIcon from "../../../assets/Owner/Registration/Gallery.svg";
import CloseIcon from "../../../assets/Common/Close.svg";
import PhotoDeleteIcon from "../../../assets/Owner/Registration/PhotoDelete.svg";


export default function StoreRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const couponPin = location.state?.couponPin;
  const saved = location.state;

  /* ---------- 필수 state ---------- */
  const [storeName, setStoreName] = useState(saved?.storeName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(saved?.phoneNumber ?? "");
  const [detailAddress, setDetailAddress] = useState(
    saved?.detailAddress ?? ""
  );
  const [selectedType, setSelectedType] = useState<string | null>(
    saved?.selectedType ?? null
  );
  const [intro, setIntro] = useState(saved?.intro ?? "");

  const [menuNames, setMenuNames] = useState<string[]>(
    saved?.menuNames ?? ["", "", ""]
  );
  const [menuPrices, setMenuPrices] = useState<string[]>(
    saved?.menuPrices ?? ["", "", ""]
  );
  const [snsUrl, setSnsUrl] = useState(saved?.snsUrl ?? "");


  useEffect(() => {
  if (!saved) return;

  if (saved.storeName !== undefined) setStoreName(saved.storeName);
  if (saved.phoneNumber !== undefined) setPhoneNumber(saved.phoneNumber);
  if (saved.detailAddress !== undefined) setDetailAddress(saved.detailAddress);
  if (saved.selectedType !== undefined) setSelectedType(saved.selectedType);
  if (saved.intro !== undefined) setIntro(saved.intro);
  if (saved.snsUrl !== undefined) setSnsUrl(saved.snsUrl);

  if (saved.menuNames) setMenuNames(saved.menuNames);
  if (saved.menuPrices) setMenuPrices(saved.menuPrices);
  if (saved.menuImages) setMenuImages(saved.menuImages);
}, [saved]);


  /* ---------- 주소 ---------- */
  const address = saved?.address ?? "";

  /* ---------- 사진 ---------- */
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [menuImages, setMenuImages] = useState<(string | null)[]>(
    saved?.menuImages ?? [null, null, null]
  );
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    navigate("/owner/store/register/photo", {
      state: {
        couponPin,
        storeName,
        phoneNumber,
        address,
        detailAddress,
        selectedType,
        intro,
        snsUrl,
        menuNames,
        menuPrices,
        menuImages,
      },
    });
  };

/* ---------- 전화번호 포맷 ---------- */
const formatPhoneNumber = (value: string) => {
  const rawNumbers = value.replace(/\D/g, "");

  // 02 (서울)
  if (rawNumbers.startsWith("02")) {
    const numbersOnly = rawNumbers.slice(0, 10);

    if (numbersOnly.length <= 2) return numbersOnly;
    if (numbersOnly.length <= 5)
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
    if (numbersOnly.length <= 9)
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 5)}-${numbersOnly.slice(5)}`;

    return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
  }

  // 3자리 지역번호 또는 휴대폰
  const numbersOnly = rawNumbers.slice(0, 11);

  if (numbersOnly.length <= 3) return numbersOnly;

  // 10자리 (지역번호 등)
  if (numbersOnly.length === 10) {
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
      3,
      6
    )}-${numbersOnly.slice(6)}`;
  }

  // 11자리 (휴대폰)
  if (numbersOnly.length > 7) {
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
      3,
      7
    )}-${numbersOnly.slice(7)}`;
  }

  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
};




  /* ---------- 사진 선택 ---------- */
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || currentMenuIndex === null) return;

    try {
      // presigned 바로 받음
      const { uploadUrl, fileUrl } = await getPresignedUrl({
        purpose: "STORE_IMAGE",
        files: [
          {
            fileName: file.name,
            contentType: file.type,
            contentLength: file.size,
          },
        ],
      });

      // S3 업로드
      await uploadToS3(uploadUrl, file);

      // state 저장
      setMenuImages((prev) => {
        const next = [...prev];
        next[currentMenuIndex] = fileUrl;
        return next;
      });

    } catch (error) {
      console.error("메뉴 이미지 업로드 실패", error);
    }

    setIsPhotoModalOpen(false);
    e.target.value = "";
  };




  /* ---------- 필수 입력 검증 ---------- */
  const isFormValid =
    storeName.trim() &&
    phoneNumber.trim() &&
    address.trim() &&
    detailAddress.trim() &&
    selectedType &&
    intro.trim() &&
    menuNames.every((n) => n.trim()) &&
    menuPrices.every((p) => p.trim()) &&
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
              value={address}
              readOnly
              className="flex-1 h-[48px] rounded-lg border border-neutrals-04 px-3"
            />
            <button
              type="button"
              onClick={() =>
                navigate("/owner/store/address-search", {
                  state: {
                    couponPin,
                    storeName,
                    phoneNumber,
                    detailAddress,
                    selectedType,
                    intro,
                    snsUrl,
                    menuNames,
                    menuPrices,
                    menuImages,
                  },
                })
              }
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
          <input
            value={snsUrl}
            onChange={(e) => setSnsUrl(e.target.value)}
            className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3"
          />
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

              <div className="relative w-[111px] h-[111px] rounded-lg border border-neutrals-04 overflow-hidden">
                <div
                  onClick={() => {
                    setCurrentMenuIndex(index);
                    setIsPhotoModalOpen(true);
                  }}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
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

                {/* 삭제 버튼 */}
                {menuImages[index] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuImages((prev) => {
                        const next = [...prev];
                        next[index] = null;
                        return next;
                      });
                    }}
                    className="absolute top-1 right-1 w-6 h-6"
                  >
                    <img src={PhotoDeleteIcon} className="w-full h-full" />
                  </button>
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
          onClick={handleSubmit}
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
              <label className="w-full flex items-center gap-4 cursor-pointer">
                <img src={CameraIcon} className="w-[24px] h-[24px]" />
                <span>카메라로 촬영하기</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </label>

              <label className="w-full flex items-center gap-4 cursor-pointer">
                <img src={GalleryIcon} className="w-[24px] h-[24px]" />
                <span>앨범에서 선택하기</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </label>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
