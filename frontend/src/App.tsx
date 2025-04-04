import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Nav from "./components/nav/Nav";
import { useBreadcrumb } from "./components/zustand/useBreadcrumb";
import { Space } from "antd";
import { useEffect } from "react";

function App() {
  const breadCrumb = useBreadcrumb((state) => state.breadcrumb);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${JSON.parse(localStorage.getItem("selectedKey") || "[]")[0]}`);
  }, []);

  useEffect(() => {
    useBreadcrumb.setState(() => {
      return {
        breadcrumb: JSON.parse(localStorage.getItem("breadcrumb") || "[]"),
      };
    });
  }, [localStorage.getItem("breadcrumb")]);

  return (
    <div className="w-full h-full flex flex-row justify-between items-start">
      <div className="w-[15%] ">
        <Nav />
      </div>
      <div className="w-[85%] h-[730px] mx-[10px] flex flex-col justify-start items-center">
        <Space
          size={"middle"}
          className="w-full text-[20px] min-h-[60px] border-1 border-[#f0f0f0] rounded-[10px] pl-[10px] mb-[100px]">
          {breadCrumb?.map((brc, index, arr) =>
            index === arr.length - 1 ? (
              <span key={index}>{brc.title}</span>
            ) : (
              <>
                <span
                  key={index}
                  style={{
                    color: "#d0d0d0",
                  }}>
                  {brc.title}
                </span>
                <span
                  style={{
                    color: "#d0d0d0",
                  }}>
                  {">"}
                </span>
              </>
            )
          )}
        </Space>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
