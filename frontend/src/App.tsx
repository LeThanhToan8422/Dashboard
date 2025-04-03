import { Outlet } from "react-router-dom";
import "./App.css";
import Nav from "./components/nav/Nav";

function App() {
  return (
    <div className="flex flex-row justify-between items-start">
      <div className="w-[15%] border-r border-black-200">
        <Nav />
      </div>
      <div className="w-[85%] border-1 border-black-200">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
