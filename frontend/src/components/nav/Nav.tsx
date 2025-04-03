import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items: MenuItem[] = [
    {
      key: "dashboards",
      icon: (
        <img
          className="w-[15px] h-[15px]"
          src="https://img.icons8.com/material-sharp/24/dashboard-layout.png"
          alt="dashboard-layout"
        />
      ),
      label: "Dashboards",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "users",
      icon: (
        <img
          className="w-[15px] h-[15px]"
          src="https://img.icons8.com/windows/32/user-group-woman-woman.png"
          alt="user-group-woman-woman"
        />
      ),
      label: "Users",
      children: [
        {
          key: "user",
          label: "User",
          icon: (
            <img
              width="15"
              height="15"
              src="https://img.icons8.com/ios/50/user--v1.png"
              alt="user--v1"
            />
          ),
          onClick: () => navigate("/user"),
        },
        {
          key: "voucher",
          label: "Voucher",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/windows/32/discount-ticket.png"
              alt="discount-ticket"
            />
          ),
          onClick: () => navigate("/voucher"),
        },
      ],
    },
    {
      key: "products",
      icon: (
        <img
          className="w-[15px] h-[15px]"
          src="https://img.icons8.com/ios/50/shopping-1.png"
          alt="shopping-1"
        />
      ),
      label: "Products",
      children: [
        {
          key: "product",
          label: "Product",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/ios/50/product--v1.png"
              alt="product--v1"
            />
          ),
          onClick: () => navigate("/product"),
        },
      ],
    },
    {
      key: "services",
      label: "Services",
      icon: (
        <img
          className="w-[15px] h-[15px]"
          src="https://img.icons8.com/ios/50/services--v1.png"
          alt="services--v1"
        />
      ),
      children: [
        {
          key: "service",
          label: "Service",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/ios/50/service--v1.png"
              alt="service--v1"
            />
          ),
          onClick: () => navigate("/service"),
        },
      ],
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="w-full">
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      {!collapsed && <img src="./large.png" alt="logo" />}
      <Menu
        defaultSelectedKeys={["dashboards"]}
        defaultOpenKeys={["users", "products", "services"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default Nav;
