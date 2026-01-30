import { Routes, Route } from "react-router-dom";
import GuestPositMainPage from "../pages/Guest/Posit/GuestPositMainPage";
import GuestPositWaitingAnswer from "../pages/Guest/Posit/GuestPositWaitingAnswer";
import GuestPositSelectedAnswer from "../pages/Guest/Posit/GuestPositSelectedAnswer";
import CouponPage from "../pages/Guest/Coupon/CouponPage";
import CouponBox from "../pages/Guest/Coupon/CouponBox";
import Onboarding from "../pages/Onboarding/Onboarding";
import Home from "../pages/Guest/Main/Home";
import SplashPage from "../pages/Splash/SplashPage";
import UserTypeSelect from "../pages/Onboarding/UserTypeSelect";
import OwnerSignUpPage from "../pages/SignUp/OwnerSIgnUpPage";
import GuestSignUpPage from "../pages/SignUp/GuestSignUpPage";
import GuestLoginPage from "../pages/Login/GuestLoginPage";
import OwnerLoginPage from "../pages/Login/OwnerLoginPage";
import GuestPositSelectedDetail from "../pages/Guest/Posit/GuestPositSelectedDetail";
import GuestPositWaitingDetail from "../pages/Guest/Posit/GuestPositWaitingDetail";
import CouponVerifyPage from "../pages/Guest/Coupon/CouponVerifyPage";
import PositInbox from "../pages/Owner/Posit/PositInbox";
import OwnerMyPage from "../pages/Owner/My/OwnerMyPage";
import GuestMyPage from "../pages/Guest/My/GuestMyPage";
import GuestMyPolicy from "../pages/Guest/My/GuestMyPolicy";
import GuestMyAccount from "../pages/Guest/My/GuestMyAccount";
import OwnerMyPolicy from "../pages/Owner/My/OwnerMyPolicy";
import OwnerMyAccount from "../pages/Owner/My/OwnerMyAccount";
import OwnerMyCoupon from "../pages/Owner/My/OwnerMyCoupon";
import OwnerMyStore from "../pages/Owner/My/OwnerMyStore";

export default function Router() {
  return (
      <Routes>
        {/* Onboarding */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/type" element={<UserTypeSelect />} />
        
        {/* Guest */}
        {/* Guest - login */}
        <Route path="/guest/login" element={<GuestLoginPage />}/>
        <Route path="/guest/signup" element={<GuestSignUpPage />}/>

        {/* Guest - home */}
        <Route path="/guest/home" element={<Home />} />
        {/* TODO : 가게 별로 다르게 표시해야함  */}

        {/* Guest - POSiT */}
        <Route path="/guest/posit" element={<GuestPositMainPage />} />
        <Route path="/guest/posit/waiting" element={<GuestPositWaitingAnswer />} />
        <Route path="/guest/posit/selected" element={<GuestPositSelectedAnswer />} />
        <Route
          path="/guest/posit/selected/:id"
          element={<GuestPositSelectedDetail />}
        />
        <Route
          path="/guest/posit/waiting/:id"
          element={<GuestPositWaitingDetail />}
        />

        {/* Guest - 쿠폰 */}
        <Route path="/guest/coupon" element={<CouponBox />} />
        <Route
          path="/guest/coupon/:id"
          element={<CouponPage />}
        />
        <Route path="/guest/coupon/:id/verify" element={<CouponVerifyPage />} />

        {/* Guest - MY */}
        <Route path="/guest/my" element={<GuestMyPage/>}/>
        <Route path="/guest/my/policy" element={<GuestMyPolicy/>}/>
        <Route path="/guest/my/account" element={<GuestMyAccount/>}/>

        {/* Owner */}
        {/* Owner - login */}
        <Route path="/owner/login" element={<OwnerLoginPage />}/>
        <Route path="/owner/signup" element={<OwnerSignUpPage />}/>

        {/* Owner - MY*/}
        <Route path="/owner/my" element={<OwnerMyPage/>} />
        <Route path="/owner/my/policy" element={<OwnerMyPolicy/>} />
        <Route path="/owner/my/account" element={<OwnerMyAccount/>}/>
        <Route path="/owner/my/coupon" element={<OwnerMyCoupon/>} />
        <Route path="/owner/my/store" element={<OwnerMyStore/>} />
        

        {/* Owner - Home (아직 미완성이라 비워둠)
        <Route path="/owner/home" element={} />*/}

        {/* Owner - Inbox*/}
        <Route path="/owner/inbox" element={<PositInbox/>}/>


      </Routes>
  );
}
