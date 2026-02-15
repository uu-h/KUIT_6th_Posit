import { useEffect, useMemo, useState } from "react";
import CouponRadioGroup, { type CouponOption } from "./CouponRadioGroup";
import InfoLine from "./InfoLine";
import {
  getOwnerCouponTemplates,
  type CouponTemplate,
} from "../../../api/ownerCouponTemplate"; // 경로 맞게

type CouponSectionProps = {
  value: CouponOption | "";
  onChange: (value: CouponOption) => void;

  // 추가: 선택된 templateId를 부모로 올림
  onTemplateIdChange: (templateId: number | null) => void;
};

function inferOptionFromTitle(title: string): CouponOption | null {
  const t = title.toLowerCase();

  // 한글 기준 매칭
  if (t.includes("아메리카노")) return "americano";
  if (t.includes("디저트")) return "dessert";
  if (t.includes("아이스티") || t.includes("ice")) return "icetea";

  return null;
}

export default function CouponSection({
  value,
  onChange,
  onTemplateIdChange,
}: CouponSectionProps) {
  const [templates, setTemplates] = useState<CouponTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  // option -> templateId 맵 생성
  const optionToTemplateId = useMemo(() => {
    const map: Partial<Record<CouponOption, number>> = {};

    for (const tpl of templates) {
      const opt = inferOptionFromTitle(tpl.title);
      if (!opt) continue;
      // 같은 opt가 여러개면 첫 번째만 사용(정책 필요하면 바꿀 수 있음)
      if (map[opt] == null) map[opt] = tpl.templateId;
    }
    return map;
  }, [templates]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await getOwnerCouponTemplates();
        if (!res.isSuccess) throw new Error("쿠폰 템플릿 조회에 실패했어요.");
        setTemplates(res.data ?? []);
      } catch (e) {
        alert(
          e instanceof Error
            ? e.message
            : "쿠폰 템플릿 조회 중 오류가 발생했어요.",
        );
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 선택값(value)이 바뀌면 해당 templateId를 부모에 전달
  useEffect(() => {
    if (!value) {
      onTemplateIdChange(null);
      return;
    }
    const tid = optionToTemplateId[value];
    onTemplateIdChange(typeof tid === "number" ? tid : null);
  }, [value, optionToTemplateId, onTemplateIdChange]);

  const handleChange = (next: CouponOption) => {
    onChange(next);

    const tid = optionToTemplateId[next];
    onTemplateIdChange(typeof tid === "number" ? tid : null);
  };

  const missing = value && optionToTemplateId[value as CouponOption] == null;

  return (
    <section className="mt-[15px]">
      <h2 className="typo-15-medium">채택 시 쿠폰 지급 설정</h2>

      {/* 템플릿 로딩 중이면 UX상 disable 하고 싶다면 CouponRadioGroup에 disabled prop 추가해도 됨 */}
      <CouponRadioGroup value={value} onChange={handleChange} />

      {loading ? (
        <InfoLine
          className="mt-[12px]"
          text="쿠폰 템플릿을 불러오는 중이에요..."
        />
      ) : missing ? (
        <InfoLine
          className="mt-[12px]"
          text="선택한 쿠폰에 해당하는 템플릿이 없어요. (서버 템플릿 설정 확인 필요)"
        />
      ) : null}

      <InfoLine
        className="mt-[20px]"
        text="사용자의 아이디어가 채택되면 자동으로 쿠폰이 지급됩니다."
      />
    </section>
  );
}
