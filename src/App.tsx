// import Onboarding from "./pages/Onboarding/Onboarding";
import SplashPage from "./pages/SplashPage";
import GuestLoginPage from "./pages/Login/GuestLoginPage";
import OwnerLoginPage from "./pages/Login/OwnerLoginPage";


function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
        {/* <Onboarding></Onboarding> */}
        {/*<SplashPage></SplashPage>*/}
        {/*<GuestLoginPage></GuestLoginPage>*/}
        <OwnerLoginPage></OwnerLoginPage>
      </div>
    </div>
  );
}
export default App;
