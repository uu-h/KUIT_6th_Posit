import Onboarding from "./pages/Onboarding/Onboarding";
import CouponPage from "./pages/Guest/Coupon/CouponPage";
import PositInbox from "./pages/Owner/PositInbox";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
         <CouponPage></CouponPage>

      </div>
    </div>
  );
}
export default App;
