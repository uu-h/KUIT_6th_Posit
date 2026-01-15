// import Onboarding from "./pages/Onboarding/Onboarding";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import CouponBox from "./pages/Coupon/CouponBox";
import CouponCard from "./pages/Coupon/components/CouponCard";

function App() {
  return (
    <div className="h-screen w-full flex justify-center">
      <div className="w-[375px] h-full relative overflow-hidden">
       <CouponBox></CouponBox>
        {/*<LoginPage></LoginPage>*/}
      </div>
    </div>
  );
}
export default App;
