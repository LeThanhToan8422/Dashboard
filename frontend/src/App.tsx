import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Nav from "./components/nav/Nav";
import { useBreadcrumb } from "./components/zustand/useBreadcrumb";
import { Avatar, Dropdown, Space } from "antd";
import { useEffect } from "react";
import { useAuthState } from "./components/zustand/useAuthState";

function App() {
  const breadCrumb = useBreadcrumb((state) => state.breadcrumb);
  const navigate = useNavigate();
  const { logout } = useAuthState();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const items = [
    {
      key: "1",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    navigate(
      localStorage.getItem("selectedKey")
        ? `/${JSON.parse(localStorage.getItem("selectedKey") || "[]")[0]}`
        : "/Dashboard"
    );
  }, [navigate]);

  useEffect(() => {
    useBreadcrumb.setState(() => {
      return {
        breadcrumb:
          JSON.parse(localStorage.getItem("breadcrumb") || "[]") ??
          JSON.stringify([{ title: "Dashboard", href: "#" }]),
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
          className="w-full text-[20px] min-h-[60px] border-1 border-[#f0f0f0] rounded-[10px] pl-[10px] mb-[100px] flex flex-row justify-between items-center">
          <div>
            {breadCrumb?.map((brc, index, arr) =>
              index === arr.length - 1 ? (
                <span key={index}>{brc.title}</span>
              ) : (
                <>
                  <span
                    key={index}
                    style={{
                      color: "#d0d0d0",
                      marginRight: "20px",
                    }}>
                    {brc.title}
                  </span>
                  <span
                    style={{
                      color: "#d0d0d0",
                      marginRight: "20px",
                    }}>
                    {">"}
                  </span>
                </>
              )
            )}
          </div>

          <Dropdown
            menu={{
              items,
            }}
            placement="bottom">
            <Avatar size={50} src={useAuthState.getState().user?.image} />
          </Dropdown>
        </Space>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
