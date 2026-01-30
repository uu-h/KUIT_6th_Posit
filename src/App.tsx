import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import OwnerHomePage from "./pages/Owner/Home/OwnerHomePage";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
        <BrowserRouter>
          {/* <Router /> */}
          <OwnerHomePage></OwnerHomePage>
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
