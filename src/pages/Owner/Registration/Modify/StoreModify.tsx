import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getStoreDetail, updateStore } from "../../../../api/modify";
import { getPresignedUrl, uploadToS3 } from "../../../../api/image";
import { http } from "../../../../api/http";

import AppBar from "../../../../components/Common/AppBar";
import Button from "../../../../components/Button";

import PhotoPlusIcon from "../../../../assets/Owner/Registration/PhotoPlus.svg";
import CameraIcon from "../../../../assets/Owner/Registration/Camera.svg";
import GalleryIcon from "../../../../assets/Owner/Registration/Gallery.svg";
import CloseIcon from "../../../../assets/Common/Close.svg";

export default function StoreModify() {
  const navigate = useNavigate();
  const location = useLocation();

  const [storeId, setStoreId] = useState<number | null>(null);
  const [storeDetail, setStoreDetail] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [roadAddress, setRoadAddress] = useState(""); 
  const [detailAddress, setDetailAddress] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [intro, setIntro] = useState("");
  const [snsUrl, setSnsUrl] = useState("");

  const [menuNames, setMenuNames] = useState<string[]>(["", "", ""]);
  const [menuPrices, setMenuPrices] = useState<string[]>(["", "", ""]);
  const [menuImages, setMenuImages] = useState<(string | null)[]>([null, null, null]);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        const idRes = await http.get("/owner/store-id");
        const id = idRes.data.data;
        if (!id) return;
        setStoreId(id);

        const storeRes = await getStoreDetail(id);
        const data = storeRes.data.data;
        setStoreDetail(data);

        const state = location.state as any;

        if (state) {
          setStoreName(state.storeName || "");
          setPhoneNumber(state.phoneNumber || "");
          setIntro(state.intro || "");
          setSnsUrl(state.snsUrl || "");
          setRoadAddress(state.roadAddress || state.address || ""); 
          setDetailAddress(state.detailAddress || "");
          setSelectedType(state.selectedType || null);
          setMenuNames(state.menuNames || ["", "", ""]);
          setMenuPrices(state.menuPrices || ["", "", ""]);
          setMenuImages(state.menuImages || [null, null, null]);
        } 
  
        else {
          setStoreName(data.name || "");
          setPhoneNumber(data.phone || "");
          setIntro(data.description || "");
          setSnsUrl(data.snsLink || "");

          const serverRoad = data.address?.road || "";
          
          if (serverRoad.includes(",")) {
            const parts = serverRoad.split(",");
            setRoadAddress(parts[0].trim());
            setDetailAddress(parts.slice(1).join(",").trim());
          } else {
            const addressRegex = /^(.*[로길]\s?(?:지하\s?)?\d+(?:-\d+)?(?:\s?\([^)]*\))?)\s?(.*)$/;
            const match = serverRoad.match(addressRegex);
            if (match) {
              setRoadAddress(match[1].trim());
              setDetailAddress(match[2].trim());
            } else {
              setRoadAddress(serverRoad);
              setDetailAddress("");
            }
          }

          const typeMap: any = { STUDY: "스터디 카페", BRUNCH: "브런치 카페", DESSERT: "디저트 카페" };
          setSelectedType(typeMap[data.typeCode] || null);
          
          const menus = data.menu || [];
          const nNames = ["", "", ""], nPrices = ["", "", ""], nImages = [null, null, null];
          menus.forEach((m: any, i: number) => {
            if (i < 3) {
              nNames[i] = m.name;
              nPrices[i] = m.price.toString();
              nImages[i] = m.imageUrl;
            }
          });
          setMenuNames(nNames); setMenuPrices(nPrices); setMenuImages(nImages);
        }
        setIsLoaded(true);
      } catch (err) { console.error(err); }
    }
    initData();
  }, [location.key]); 

  const handleAddressSearch = () => {
    navigate("/owner/store/modify/address-search", {
      state: { storeName, phoneNumber, roadAddress, detailAddress, selectedType, intro, snsUrl, menuNames, menuPrices, menuImages },
    });
  };

  const handleSubmit = async () => {
    if (!storeId || !storeDetail) return;
    try {
      const typeMap: any = { "스터디 카페": "STUDY", "브런치 카페": "BRUNCH", "디저트 카페": "DESSERT" };
      const body = {
        name: storeName,
        address: { 
          roadAddress: roadAddress.trim(),
          detailAddress: detailAddress.trim() 
        },
        type: typeMap[selectedType ?? ""],
        phone: phoneNumber,
        snsUrl: snsUrl,
        description: intro,
        imageUrls: storeDetail.images?.map((img: any) => img.imageUrl) ?? [],
        operation: {
          regularHolidays: storeDetail.notOpen ?? [],
          openDay: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].filter(d => !storeDetail.notOpen?.includes(d)),
          openTime: storeDetail.openTime?.split("-")[0] ?? "00:00",
          closeTime: storeDetail.openTime?.split("-")[1] ?? "23:59",
        },
        convinces: storeDetail.convinces ?? [],
        menus: menuNames.map((name, idx) => ({
          name,
          price: Number(menuPrices[idx].toString().replace(/[^0-9]/g, "")) || 0,
          imageUrl: menuImages[idx] ?? ""
        })),
      };

      await updateStore(body);
      setShowToast(true);
      setTimeout(() => { setShowToast(false); navigate("/owner/my/store"); }, 1200);
    } catch (err) { console.error(err); }
  };

  const formatPhoneNumber = (v: string) => {
    const raw = v.replace(/\D/g, "");
    if (raw.startsWith("02")) {
      const n = raw.slice(0, 10);
      if (n.length <= 2) return n;
      if (n.length <= 5) return `${n.slice(0, 2)}-${n.slice(2)}`;
      if (n.length <= 9) return `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5)}`;
      return `${n.slice(0, 2)}-${n.slice(2, 6)}-${n.slice(6)}`;
    }
    const n = raw.slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length === 10) return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
    if (n.length > 7) return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
    return `${n.slice(0, 3)}-${n.slice(3)}`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || currentMenuIndex === null) return;
    try {
      const { uploadUrl, fileUrl } = await getPresignedUrl({
        purpose: "STORE_IMAGE",
        files: [{ fileName: file.name, contentType: file.type, contentLength: file.size }],
      });
      await uploadToS3(uploadUrl, file);
      setMenuImages((p) => { const n = [...p]; n[currentMenuIndex!] = fileUrl; return n; });
    } catch (err) { console.error(err); }
    setIsPhotoModalOpen(false);
  };

  const isFormValid = isLoaded && storeName && phoneNumber && roadAddress && detailAddress && selectedType && intro;

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutrals-08">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />
      
      <div className="px-6 pb-10"><h1 className="typo-sub-title text-[#000000]">고객에게 소개할 가게 정보를<br/>수정해주세요</h1></div>

      <div className="flex-1 overflow-y-auto px-6 space-y-5">
        <div>
          <label className="typo-14-medium text-[#000000]">가게 이름</label>
          <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
        </div>

        <div>
          <label className="typo-14-medium text-[#000000]">가게 전화번호</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
        </div>

        <div>
          <label className="typo-14-medium text-[#000000]">가게 주소</label>
          <div className="mt-2 flex gap-2">
            <input value={roadAddress} readOnly className="flex-1 h-[48px] rounded-lg border border-neutrals-04 px-3 utline-none" />
            <button onClick={handleAddressSearch} className="w-[88px] h-[48px] rounded-[8px] bg-primary-01 text-white typo-14-medium">주소 찾기</button>
          </div>
          <input value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
        </div>

        <div>
          <label className="typo-14-medium text-[#000000]">가게 종류</label>
          <div className="mt-2 flex gap-2">
            {["스터디 카페", "브런치 카페", "디저트 카페"].map((type) => (
              <button key={type} onClick={() => setSelectedType(type)} className={`h-[43px] w-[88px] rounded-[8px] border typo-13-regular ${selectedType === type ? "bg-[#FF7A6E] text-white border-[#FF7A6E]" : "border-neutrals-04 text-neutrals-06"}`}>{type}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="typo-14-medium text-[#000000]">가게 SNS 링크</label>
          <input value={snsUrl} onChange={(e) => setSnsUrl(e.target.value)} className="mt-2 w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
        </div>

        <div>
          <label className="typo-14-medium text-[#000000]">가게 소개</label>
          <textarea value={intro} onChange={(e) => setIntro(e.target.value)} maxLength={50} className="mt-2 w-full h-[113px] rounded-lg border border-neutrals-04 px-3 py-2 resize-none mt-2 outline-none focus:border-primary-01" />
        </div>

        <div className="space-y-4">
          <label className="typo-14-medium text-[#000000]">메뉴 소개</label>
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="mt-2 space-y-2 pb-5 overflow-hidden">
              <input value={menuNames[idx]} onChange={(e) => { const n = [...menuNames]; n[idx] = e.target.value; setMenuNames(n); }} placeholder="메뉴명" className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
              <input value={menuPrices[idx]} onChange={(e) => { const p = [...menuPrices]; p[idx] = e.target.value; setMenuPrices(p); }} placeholder="가격" className="w-full h-[48px] rounded-lg border border-neutrals-04 px-3 outline-none focus:border-primary-01" />
              <div onClick={() => { setCurrentMenuIndex(idx); setIsPhotoModalOpen(true); }} className="w-[111px] h-[111px] rounded-lg flex items-center justify-center cursor-pointer bg-neutrals-01">
                {menuImages[idx] ? <img src={menuImages[idx]!} className="w-full h-full object-cover rounded-[8px]" /> : <img src={PhotoPlusIcon} className="w-8 h-8" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4">
        <Button height="h-[48px]" disabled={!isFormValid} onClick={handleSubmit}>수정 완료</Button>
      </div>

      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/40" onClick={() => setIsPhotoModalOpen(false)}>
          <div className="w-full max-w-[375px] bg-white rounded-t-[16px] px-6 pt-4 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><span className="typo-16-medium">사진 등록</span><button onClick={() => setIsPhotoModalOpen(false)}><img src={CloseIcon} className="w-4 h-4" /></button></div>
            <div className="space-y-6">
              <label className="flex items-center gap-4 cursor-pointer">
                <img src={CameraIcon} className="w-6 h-6" />
                <span className="typo-16-regular">카메라로 촬영하기</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <img src={GalleryIcon} className="w-6 h-6" />
                <span className="typo-16-regular">앨범에서 선택하기</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div className="bg-white w-[274px] h-[130px] rounded-lg flex items-center justify-center shadow-lg">
            <p className="typo-15-medium text-center text-neutrals-08">가게 정보가<br />수정되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}