import Onboarding from "./pages/Onboarding/Onboarding";
import GuestSignUp from "./pages/SignUp/GuestSignUpPage"
import OwnerLogin from "./pages/Login/OwnerLoginPage"
import GuestLogin from "./pages/Login/GuestLoginPage"

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
         <Onboarding></Onboarding>

      </div>
    </div>
  );
}
export default App;
