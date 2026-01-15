// import Onboarding from "./pages/Onboarding/Onboarding";
import SplashPage from "./pages/SplashPage";
import GuestLoginPage from "./pages/Login/GuestLoginPage";
import OwnerLoginPage from "./pages/Login/OwnerLoginPage";
import GuestSignUpPage from "./pages/SignUp/GuestSignUpPage";
import OwnerSignUpPage from "./pages/SignUp/OwnerSIgnUpPage";


function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
        {/* <Onboarding></Onboarding> */}
        {/*<SplashPage></SplashPage>*/}
        {/*<GuestLoginPage></GuestLoginPage>*/}
        {/*<OwnerLoginPage></OwnerLoginPage>*/}
        {/*<GuestSignUpPage></GuestSignUpPage>*/}
        <OwnerSignUpPage></OwnerSignUpPage>
      </div>
    </div>
  );
}
export default App;
