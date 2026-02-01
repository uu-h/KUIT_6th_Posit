import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";

function App() {
  return (
    <div className="min-h-dvh w-full flex justify-center">
      <div className="w-full max-w-[375px] min-h-dvh bg-white">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
