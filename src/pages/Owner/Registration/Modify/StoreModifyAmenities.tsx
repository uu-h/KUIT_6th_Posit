import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../../api/http";
import { getStoreDetail, updateStore } from "../../../../api/modify";
import AppBar from "../../../../components/Common/AppBar";
import Button from "../../../../components/Button";

// 영문 코드 매핑
const convenienceMap: Record<string, string> = {
  "포장 가능": "TAKEOUT",
  "배달 가능": "DELIVERY",
  "예약 가능": "RESERVATION",
  "간편결제": "EASY_PAY",
  "24시간 영업": "OPEN_24H",
  "주차 가능": "PARKING",
  "발렛 파킹": "VALET_PARKING",
  "장애인 편의시설": "ACCESSIBLE",
  "반려동물 동반 가능": "PET_FRIENDLY",
  "노키즈존": "NO_KIDS",
  "와이파이 있음": "WIFI",
  "단체석 있음": "GROUP_SEAT",
  "룸 있음": "PRIVATE_ROOM",
  "흡연실 있음": "SMOKING_ROOM",
  "야외 좌석": "OUTDOOR_SEAT",
};

const AMENITIES = {
  convenience: ["포장 가능", "배달", "예약 가능", "24시간 영업"],
  access: ["주차", "발렛 파킹", "장애인 편의시설"],
  restriction: ["반려동물 동반 가능", "노키즈존"],
  environment: ["와이파이 있음", "단체석 있음", "룸 있음", "흡연실 있음", "야외 좌석"],
};

export default function StoreModifyAmenities() {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState<number | null>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchStore() {
      try {
        // 1️⃣ storeId 가져오기
        const idRes = await http.get("/owner/store-id");
        const id = idRes.data.data;
        setStoreId(id);

        // 2️⃣ store detail 가져오기
        const res = await getStoreDetail(id);
        const data = res.data.data;
        setStoreData(data);

        // 3️⃣ convince 초기 선택
        if (Array.isArray(data.convince)) {
          setSelected(data.convince.map((c: any) => c.displayName));
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    fetchStore();
  }, []);

  const toggleItem = (item: string) => {
    setSelected(prev =>
      prev.includes(item) ? prev.filter(v => v !== item) : [...prev, item]
    );
  };

  const handleSubmit = async () => {
  if (!storeData) return;

  try {
    // 기존 데이터 그대로 가져오기
    const body = {
      name: storeData.name,
      address: {
        roadAddress: storeData.address?.road ?? "",
        detailAddress: storeData.address?.lot ?? "",
      },
      type: storeData.typeCode ?? "STUDY",
      phone: storeData.phone ?? "",
      snsUrl: storeData.snsLink ?? "",
      description: storeData.description ?? "",
      imageUrls: storeData.images?.map((img: any) => img.imageUrl) ?? [],
      operation: {
        regularHolidays: storeData.notOpen ?? [],
        openDay: ["MON","TUE","WED","THU","FRI","SAT","SUN"].filter(d => !(storeData.notOpen ?? []).includes(d)),
        openTime: storeData.openTime?.split("-")[0] || "10:00",
        closeTime: storeData.openTime?.split("-")[1] || "22:00",
      },
      // 🔥 여기서만 selected 적용
      convinces: selected.map(item => convenienceMap[item]).filter(Boolean),
      menus: storeData.menu?.map((m: any) => ({
        name: m.name,
        price: m.price,
        imageUrl: m.imageUrl
      })) ?? [],
    };

    console.log("PUT body (편의시설만 수정):", body);
    await updateStore(body);

    setShowToast(true);
    setTimeout(() => navigate("/owner/my/store"), 1200);

  } catch (e) {
    console.error(e);
    alert("편의시설 수정 실패");
  }
};

  if (loading) return <div className="p-10 text-center">데이터 로딩 중...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />
      <div className="px-6 pt-4 pb-6"><h1 className="typo-sub-title">편의시설 수정</h1></div>

      <div className="flex-1 px-6 space-y-8 overflow-y-auto pb-24">
        {Object.entries(AMENITIES).map(([key, items]) => (
          <div key={key}>
            <p className="typo-14-medium mb-3 text-neutrals-07">
              {key === 'convenience' ? '이용 편의' :
               key === 'access' ? '접근/시설' :
               key === 'restriction' ? '제한' : '매장 환경'}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <button
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`px-3 h-[43px] rounded-[8px] border typo-14-regular transition-all ${
                    selected.includes(item) ? "bg-primary-01 text-white border-primary-01" : "bg-white text-neutrals-09 border-neutrals-04"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full max-w-[375px] bg-white px-6 py-4 border-t">
        <Button height="h-[48px]" disabled={selected.length === 0} onClick={handleSubmit}>
          수정 완료
        </Button>
      </div>

      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">가게 정보가 수정되었습니다.</div>
        </div>
      )}
    </div>
  );
}
