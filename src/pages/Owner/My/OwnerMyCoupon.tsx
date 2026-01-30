import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import CouponPasswordChange from "../../../components/Owner/My/CouponPasswordChange";

type Step = "check" | "change";

export default function OwnerMyCoupon() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("check");
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <AppBar leftType="left" onBack={() => navigate(-1)} />

            <div className="flex flex-col px-[16px] mt-[13px] mb-[110px]">
            {step === "check" ? (
                <div className="flex flex-col gap-[30px]">
                    <h1 className="typo-sub-title">현재  쿠폰 비밀번호를 입력해주세요.</h1>
                    <p className="typo-16-regular text-[#5D5D5D]">비밀번호 4자리를 입력해주세요.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-[30px]">
                    <h1 className="typo-sub-title">새로운  쿠폰 비밀번호를 입력해주세요.</h1>
                    <p className="typo-16-regular text-[#5D5D5D]">비밀번호 4자리를 입력해주세요.</p>
                </div>
            )}
            </div>

            <CouponPasswordChange
                step={step}
                onStepChange={setStep}
                onComplete={() => setIsModalOpen(true)}
            />
            
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative bg-white w-[343px] overflow-hidden rounded-[8px] flex flex-col">
                        <p className="typo-15-regular text-shades-02 h-[90px] border-b border-neutrals-03 flex items-center justify-center">
                            새로운 쿠폰 비밀번호가 설정되었습니다.
                        </p>
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                navigate("/owner/my");
                            }}
                            className="w-full h-[48px] text-primary-01 typo-16-medium"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
