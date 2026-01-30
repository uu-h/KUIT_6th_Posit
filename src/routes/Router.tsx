import { Routes, Route } from "react-router-dom";
import GuestPositMainPage from "../pages/Guest/Posit/GuestPositMainPage";
import GuestPositWaitingAnswer from "../pages/Guest/Posit/GuestPositWaitingAnswer";
import GuestPositSelectedAnswer from "../pages/Guest/Posit/GuestPositSelectedAnswer";
import CouponPage from "../pages/Guest/Coupon/CouponPage";
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
import StoreRegistration from "../pages/Owner/Registration/StoreRegistration";
import AddressSearch from "../pages/Owner/Registration/AddressSearch";



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
        <Route path="/guest/coupon" element={<CouponPage />} />
        <Route path="/guest/coupon/verify" element={<CouponVerifyPage />} />

        {/* Guest - MY (아직 미완성이라 비워둠)
        <Route path="/guest/my" element={} />
        */}

        {/* Owner */}
        {/* Owner - login */}
        <Route path="/owner/login" element={<OwnerLoginPage />}/>
        <Route path="/owner/signup" element={<OwnerSignUpPage />}/>

        {/* Owner - MY (아직 미완성이라 비워둠)
        <Route path="/owner/my" element={} />
        */}

        {/* Owner - Home (아직 미완성이라 비워둠)
        <Route path="/owner/home" element={} />
        */}

        {/* Owner - Inbox*/}
        <Route path="/owner/inbox" element={<PositInbox/>}/>

        {/* Owner - Registration */}
        <Route path="/owner/store/register" element={<StoreRegistration />} />
        <Route path="/owner/store/address-search" element={<AddressSearch />} />



      </Routes>
  );
}
