import { BrowserRouter } from "react-router-dom";
// import Router from "./routes/Router";
import Home from "./pages/Guest/Main/Home";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
        <BrowserRouter>
          {/* <Router /> */}
          <Home></Home>
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
