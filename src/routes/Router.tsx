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
import OwnerHomePage from "../pages/Owner/Home/OwnerHomePage";

import StoreRegistration from "../pages/Owner/Registration/StoreRegistration";
import AddressSearch from "../pages/Owner/Registration/AddressSearch";
import StoreRegisterPhoto from "../pages/Owner/Registration/StoreRegisterPhoto";
import StoreRegisterHours from "../pages/Owner/Registration/StoreRegisterHours";
import StoreRegisterAmenities from "../pages/Owner/Registration/StoreRegisterAmenities";
import GuestStoreDetailPage from "../pages/Guest/Store/GuestStoreDetailPage";

import OwnerPositAnswerSelectPage from "../pages/Owner/Posit/OwnerPositAnswerSelectPage";
import OwnerPositMyConcernPage from "../pages/Owner/Posit/OwnerPositMyConcernPage";
import OwnerCouponPage from "../pages/Owner/Coupon/OwnerCouponPage";
import OwnerMyConcernsPage from "../pages/Owner/Home/OwnerMyConcernsPage";
import GuestStoreMapPage from "../pages/Guest/Store/GuestStoreMapPage";
import GuestPositCreatePage from "../pages/Guest/Posit/GuestPositCreatePage";
import GuestPositConcernListPage from "../pages/Guest/Posit/GuestPositConcernListPage";
import IdeaAdopt from "../pages/Owner/Posit/IdeaAdopt";
import OwnerMyConcernDetailPage from "../pages/Owner/Home/OwnerMyConcernDetailPage";
import OwnerMyConcerAnswerPage from "../pages/Owner/Home/OwnerMyConcernAnswerPage";
import OwnerCouponAdoptionDetailPage from "../pages/Owner/Coupon/OwnerCouponAdoptionDetailPage";
import GuestPositOwnerConcernPage from "../pages/Guest/Posit/GuestPositOwnerConcernPage";

export default function Router() {
  return (
    <Routes>
      {/* Onboarding */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/type" element={<UserTypeSelect />} />

      {/* Guest */}
      {/* Guest - login */}
      <Route path="/guest/login" element={<GuestLoginPage />} />
      <Route path="/guest/signup" element={<GuestSignUpPage />} />

      {/* Guest - home */}
      <Route path="/guest/home" element={<Home />} />

      {/* Guest - store */}
      <Route path="/stores/:storeId" element={<GuestStoreDetailPage />} />
      <Route path="/stores/:storeId/map" element={<GuestStoreMapPage />} />

      {/* Guest - POSiT */}
      {/* 가게별 사장님 포짓 (고민답변)*/}
      <Route
        path="/guest/stores/:storeId/posit/concerns"
        element={<GuestPositConcernListPage />}
      />
      <Route
        path="/guest/stores/:storeId/posit/concerns/:concernId"
        element={<GuestPositOwnerConcernPage />}
      />

      {/* 가게별 내 포짓 (자유메모)*/}
      <Route
        path="/stores/:storeId/posit/new"
        element={<GuestPositCreatePage />}
      />

      <Route path="/guest/posit" element={<GuestPositMainPage />} />
      <Route
        path="/guest/posit/waiting"
        element={<GuestPositWaitingAnswer />}
      />
      <Route
        path="/guest/posit/selected"
        element={<GuestPositSelectedAnswer />}
      />
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
      <Route path="/guest/coupon/:id" element={<CouponPage />} />
      <Route path="/guest/coupon/:id/verify" element={<CouponVerifyPage />} />

      {/* Guest - MY */}
      <Route path="/guest/my" element={<GuestMyPage />} />
      <Route path="/guest/my/policy" element={<GuestMyPolicy />} />
      <Route path="/guest/my/account" element={<GuestMyAccount />} />

      {/* Owner */}
      {/* Owner - login */}
      <Route path="/owner/login" element={<OwnerLoginPage />} />
      <Route path="/owner/signup" element={<OwnerSignUpPage />} />

      {/* Owner - MY*/}
      <Route path="/owner/my" element={<OwnerMyPage />} />
      <Route path="/owner/my/policy" element={<OwnerMyPolicy />} />
      <Route path="/owner/my/account" element={<OwnerMyAccount />} />
      <Route path="/owner/my/coupon" element={<OwnerMyCoupon />} />
      <Route path="/owner/my/store" element={<OwnerMyStore />} />

      {/*Owner - Home*/}
      <Route path="/owner/home" element={<OwnerHomePage />} />
      <Route
        path="/owner/home/post-concern"
        element={<OwnerPositMyConcernPage />}
      />
      <Route path="/owner/home/coupon-manage" element={<OwnerCouponPage />} />
      <Route path="/owner/home/concerns" element={<OwnerMyConcernsPage />} />
      <Route
        path="/owner/home/concerns/:concernId"
        element={<OwnerMyConcernDetailPage />}
      />
      <Route
        path="/owner/home/concerns/:concernId/answer/:memoId"
        element={<OwnerMyConcerAnswerPage />}
      />
      <Route
        path="/owner/home/coupon-adoptions/:memoId"
        element={<OwnerCouponAdoptionDetailPage />}
      />

      {/* Owner - Inbox*/}
      <Route path="/owner/inbox" element={<PositInbox />} />
      <Route path="/owner/inbox/:id" element={<OwnerPositAnswerSelectPage />} />
      <Route path="/owner/inbox/:id/adopted" element={<IdeaAdopt />} />

      {/* Owner - Posit*/}
      <Route
        path="/owner/answer-select"
        element={<OwnerPositAnswerSelectPage />}
      />

      {/* Owner - Registration */}
      <Route path="/owner/store/register" element={<StoreRegistration />} />
      <Route path="/owner/store/address-search" element={<AddressSearch />} />
      <Route
        path="/owner/store/register/photo"
        element={<StoreRegisterPhoto />}
      />
      <Route
        path="/owner/store/register/hours"
        element={<StoreRegisterHours />}
      />
      <Route
        path="/owner/store/register/amenities"
        element={<StoreRegisterAmenities />}
      />
    </Routes>
  );
}
