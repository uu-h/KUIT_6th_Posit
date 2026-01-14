// import Onboarding from "./pages/Onboarding/Onboarding";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import CuponBox from "./pages/Cupon/CuponBox";
import CouponPage from "./pages/Cupon/CuponPage";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
       <CouponPage></CouponPage>
        {/*<LoginPage></LoginPage>*/}
      </div>
    </div>
  );
}
export default App;
