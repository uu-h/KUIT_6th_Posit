import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-[375px] min-h-screen flex justify-center">
      <BrowserRouter>
          <Router />
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
