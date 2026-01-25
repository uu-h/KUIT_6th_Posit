import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernTextareaCard from "../../../components/Owner/Posit/ConcernTextareaCard";
import Divider from "../../../components/Owner/Posit/Divider";
import CouponSection from "../../../components/Owner/Posit/CouponSection";
import Button from "../../../components/Button";
import SuccessModal from "../../../components/Common/SuccessModal";

type CouponOption = "americano" | "dessert" | "icetea";

export default function OwnerPositMyConcernPage() {
  const [content, setContent] = useState("");
  const [coupon, setCoupon] = useState<CouponOption | "">("");
  const [openSuccess, setOpenSuccess] = useState(false);

  const isEnabled = content.trim().length > 0 && coupon !== "";

  const MAX_LEN = 150;

  const handleClickConfirm = () => {
    if (!isEnabled) return;
    setOpenSuccess(true);
  };

  const handleModalConfirm = () => {
    setOpenSuccess(false);

    // 선택: 확인 누른 후 동작
    // 1) 입력 초기화
    // setContent("");
    // setCoupon("");

    // 2) 뒤로가기/다른 페이지 이동이 필요하면 여기서 처리
  };

  return (
    <div className="min-h-dvh w-full px-[16px] bg-white flex flex-col">
      {/* Header */}
      <AppBar title="나의 고민거리" layout="left" leftType="left" />
      {/* Body */}
      <main className=" flex-1">
        {/* Textarea Card */}
        <ConcernTextareaCard
          value={content}
          onChange={setContent}
          maxLength={MAX_LEN}
        />

        {/* Divider */}
        <Divider className="mt-[22px]" />

        {/* Coupon Section */}
        <CouponSection value={coupon} onChange={setCoupon} />
      </main>
      {/* Bottom Button */}
      <div className=" pt-[65px]">
        <Button
          disabled={!isEnabled}
          onClick={handleClickConfirm}
          height="h-[43px]"
        >
          확인
        </Button>
      </div>
      {/* Success Modal */}
      <SuccessModal
        open={openSuccess}
        onConfirm={handleModalConfirm}
        description={`고민거리가 업로드 되었어요!
채택될 경우 알려드릴게요.`}
      />{" "}
    </div>
  );
}