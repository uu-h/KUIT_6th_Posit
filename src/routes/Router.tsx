import { Routes, Route } from "react-router-dom";
import GuestPositMainPage from "../pages/Guest/Posit/GuestPositMainPage";
import GuestPositWaitingAnswer from "../pages/Guest/Posit/GuestPositWaitingAnswer";
import GuestPositSelectedAnswer from "../pages/Guest/Posit/GuestPositSelectedAnswer";
import CouponPage from "../pages/Guest/Coupon/CouponPage";
import Onboarding from "../pages/Onboarding/Onboarding";

export default function Router() {
  return (
      <Routes>

        <Route path="/" element={<Onboarding />} />

        {/* Guest - 홈 (아직 미완성이라 비워둠)
        <Route path="/home" element={} />
        */}

        {/* Guest - POSiT */}
        <Route path="/posit" element={<GuestPositMainPage />} />
        <Route path="/posit/waiting" element={<GuestPositWaitingAnswer />} />
        <Route path="/posit/selected" element={<GuestPositSelectedAnswer />} />

        {/* Guest - 쿠폰 */}
        <Route path="/coupon" element={<CouponPage />} />

        {/* Guest - MY (아직 미완성이라 비워둠)
        <Route path="/my" element={} />
        */}
      </Routes>
  );
}
