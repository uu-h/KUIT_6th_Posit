import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../../api/http";
import { getStoreDetail, updateStore } from "../../../../api/modify";
import AppBar from "../../../../components/Common/AppBar";
import Button from "../../../../components/Button";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const ALL_DAYS_ENUM = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_MAP: Record<string, string> = { MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" };
const DAY_MAP_REVERSE: Record<string, string> = { 월: "MON", 화: "TUE", 수: "WED", 목: "THU", 금: "FRI", 토: "SAT", 일: "SUN" };

export default function StoreModifyHours() {
  const navigate = useNavigate();
  const [storeDetail, setStoreDetail] = useState<any>(null);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => { fetchStore(); }, []);

  const fetchStore = async () => {
    try {
      const idRes = await http.get("/owner/store-id");
      const detailRes = await getStoreDetail(idRes.data.data);
      const data = detailRes.data.data;
      setStoreDetail(data);
      const openDayEnums = ALL_DAYS_ENUM.filter(d => !data.notOpen?.includes(d));
      setOpenDays(openDayEnums.map(d => DAY_MAP[d]));
      if (data.openTime?.includes("-")) {
        const [start, end] = data.openTime.split("-");
        setStartHour(start.split(":")[0]); setStartMinute(start.split(":")[1]);
        setEndHour(end.split(":")[0]); setEndMinute(end.split(":")[1]);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    if (!storeDetail) return;
    try {
      const openDayEnums = openDays.map(d => DAY_MAP_REVERSE[d]);
      const regularHolidays = ALL_DAYS_ENUM.filter(d => !openDayEnums.includes(d));
      const body = {
        name: storeDetail.name,
        address: { roadAddress: storeDetail.address?.road ?? "", detailAddress: "" },
        type: storeDetail.typeCode ?? "STUDY",
        phone: storeDetail.phone ?? "",
        snsUrl: storeDetail.snsLink ?? "",
        description: storeDetail.description ?? "",
        imageUrls: storeDetail.images?.map((img: any) => img.imageUrl) ?? [],
        operation: {
          regularHolidays,
          openDay: openDayEnums,
          openTime: `${startHour}:${startMinute}`,
          closeTime: `${endHour}:${endMinute}`,
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
  const isValid = openDays.length > 0 && startHour && startMinute && endHour && endMinute;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />
      <div className="flex-1 px-[16px]">
        <div className="flex flex-col gap-[40px]">
          <h1 className="typo-sub-title">운영시간 및 휴무일을<br/> 수정해주세요</h1>
          <div>
            <h2 className="typo-15-medium">영업시간</h2>
            <h3 className="typo-13-regular text-shades-02">영업하는 요일을 선택해주세요. <br/>하지 않은 요일은 자동으로 휴무로 설정됩니다.</h3>
          </div>
        </div>

        <div className="flex justify-center gap-[20px] py-[12px]">
          {DAYS.map(d => (<button 
            key={d} 
            onClick={() => setOpenDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d])} 
            className={`w-[32px] h-[32px] rounded-full typo-14-regular
              ${openDays.includes(d) ? "bg-primary-01 text-white" : "bg-neutrals-03 text-neutrals-09"}`}>{d}</button>))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <input 
            value={startHour || ""} 
            onChange={e => setStartHour(e.target.value.replace(/\D/g, "").slice(0,2))} 
            placeholder="00" 
            className="w-[69px] h-[48px] border border-neutrals-04 rounded-lg text-center focus:border-primary-01 focus:outline-none"  /> 
          <span className="text-neutrals-04">:</span>
          <input 
            value={startMinute || ""} 
            onChange={e => setStartMinute(e.target.value.replace(/\D/g, "").slice(0,2))} 
            placeholder="00" 
            className="w-[69px] h-[48px] border border-neutrals-04 rounded-lg text-center focus:border-primary-01 focus:outline-none"  /> 
          <span className="text-neutrals-04">~</span>
          <input 
            value={endHour || ""} 
            onChange={e => setEndHour(e.target.value.replace(/\D/g, "").slice(0,2))} 
            placeholder="00" 
            className="w-[69px] h-[48px] border border-neutrals-04 rounded-lg text-center focus:border-primary-01 focus:outline-none"  /> 
          <span className="text-neutrals-04">:</span>
          <input 
            value={endMinute || ""} 
            onChange={e => setEndMinute(e.target.value.replace(/\D/g, "").slice(0,2))} 
            placeholder="00" 
            className="w-[69px] h-[48px] border border-neutrals-04 rounded-lg text-center focus:border-primary-01 focus:outline-none" />
        </div>
      </div>

      <div className="p-6">
        <Button height="h-[48px]" disabled={!isValid} onClick={handleUpdate}>
          수정 완료
        </Button>
      </div>

      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div className="bg-white w-[274px] h-[130px] rounded-lg flex items-center justify-center shadow-lg">
            <p className="typo-15-medium text-center">
              운영 시간이<br />수정되었습니다.
            </p>
          </div>
      </div>)}
    </div>
  );
}