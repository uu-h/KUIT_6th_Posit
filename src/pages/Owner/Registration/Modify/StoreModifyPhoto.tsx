import { useEffect, useState, useRef } from "react";
import { http } from "../../../../api/http";
import { getStoreDetail, updateStore } from "../../../../api/modify";
import { getPresignedUrl, uploadToS3 } from "../../../../api/image";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../../components/Common/AppBar";
import Button from "../../../../components/Button";

import PhotoPlusIcon from "../../../../assets/Owner/Registration/PhotoPlus.svg";
import PhotoDeleteIcon from "../../../../assets/Owner/Registration/PhotoDelete.svg";

export default function StoreModifyPhoto() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storeDetail, setStoreDetail] = useState<any>(null);
  const [photos, setPhotos] = useState<(string | null)[]>(Array(5).fill(null));
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => { fetchStore(); }, []);

  const fetchStore = async () => {
    try {
      const idRes = await http.get("/owner/store-id");
      const detailRes = await getStoreDetail(idRes.data.data);
      const data = detailRes.data.data;
      setStoreDetail(data);
      const existing = data.images?.map((img: any) => img.imageUrl) ?? [];
      const padded = [...existing];
      while (padded.length < 5) padded.push(null);
      setPhotos(padded);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || currentIndex === null) return;
    try {
      const { uploadUrl, fileUrl } = await getPresignedUrl({
        purpose: "STORE_IMAGE",
        files: [{ fileName: file.name, contentType: file.type, contentLength: file.size }],
      });
      await uploadToS3(uploadUrl, file);
      setPhotos((p) => { const n = [...p]; n[currentIndex!] = fileUrl; return n; });
    } catch (e) { console.error(e); }
    e.target.value = "";
    setCurrentIndex(null);
  };

  const handleUpdate = async () => {
    if (!storeDetail) return;
    try {
      const ALL_DAYS_ENUM = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      const body = {
        name: storeDetail.name,
        address: { roadAddress: storeDetail.address?.road ?? "", detailAddress: "" }, 
        type: storeDetail.typeCode ?? "STUDY",
        phone: storeDetail.phone ?? "",
        snsUrl: storeDetail.snsLink ?? "",
        description: storeDetail.description ?? "",
        imageUrls: photos.filter((p): p is string => !!p),
        operation: {
          regularHolidays: storeDetail.notOpen ?? [],
          openDay: ALL_DAYS_ENUM.filter(d => !storeDetail.notOpen?.includes(d)),
          openTime: storeDetail.openTime?.split("-")[0] ?? "00:00",
          closeTime: storeDetail.openTime?.split("-")[1] ?? "23:59",
        },
        convinces: storeDetail.convinces ?? [],
        menus: storeDetail.menu?.map((m: any) => ({ name: m.name, price: m.price, imageUrl: m.imageUrl })) ?? [],
      };
      await updateStore(body);
      setShowToast(true);
      setTimeout(() => { setShowToast(false); navigate(-1); }, 1200);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-6">로딩중...</div>;
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />
      <div className="flex-1 px-[16px]">
        <div className="flex flex-col gap-[12px]">
          <h1 className="typo-sub-title">가게 사진을 수정해주세요</h1>
          <h3 className="typo-13-regular text-neutrals-07">외관, 내관, 메뉴 사진 등을 추천해요. (최소 3장, 최대 5장)</h3>
        </div> 

        <div className="flex flex-col gap-[6px] mt-[35px]">
           <h2 className="typo-14-medium">첨부파일</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <div
                key={i}
                className={`relative w-[107px] h-[107px] rounded-lg flex items-center justify-center overflow-hidden border ${p ? "border-transparent" : "border-neutrals-04"}`}
              >
                <div onClick={() => { setCurrentIndex(i); fileInputRef.current?.click(); }} className="w-full h-full flex items-center justify-center cursor-pointer">
                  {p ? <img src={p} className="w-full h-full object-cover" /> : <img src={PhotoPlusIcon} className="w-8 h-8" />}
                </div>
                {p && <button onClick={(e) => { e.stopPropagation(); setPhotos(prev => { const n = [...prev]; n[i] = null; return n; }); }} className="absolute top-1 right-1 w-6 h-6"><img src={PhotoDeleteIcon} /></button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button height="h-[48px]" disabled={photos.filter(Boolean).length === 0} onClick={handleUpdate}>
          수정 완료
          </Button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {showToast && (<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"><div className="bg-white w-[274px] h-[130px] rounded-lg flex items-center justify-center shadow-lg"><p className="typo-15-medium text-center">가게 사진이<br />수정되었습니다.</p></div></div>)}
    </div>
  );
}