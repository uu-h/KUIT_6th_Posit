import CouponPasswordChange from "../../../components/Owner/My/CouponPasswordChange";

export default function OwnerMyCoupon() {
  return (
    <>
      <CouponPasswordChange
        onComplete={(newPassword) => {
          console.log("새 비밀번호:", newPassword);
          // 여기서 mock 업데이트 or toast
        }}
      />
    </>
  );
}
