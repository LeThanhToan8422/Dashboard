import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useBreadcrumb } from "../zustand/useBreadcrumb";

type MenuItem = Required<MenuProps>["items"][number];

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const items: MenuItem[] = [
    {
      key: "Dashboards",
      icon: (
        <img
          className="w-[15px] h-[15px]"
          src="https://img.icons8.com/material-sharp/24/dashboard-layout.png"
          alt="dashboard-layout"
        />
      ),
      label: "Dashboards",
      onClick: () => {
        navigate("/dashboard");
        localStorage.setItem(
          "breadcrumb",
          JSON.stringify([
            {
              title: "Dashboard",
              href: "#",
            },
          ])
        );
        localStorage.setItem("selectedKey", JSON.stringify(["Dashboards"]));
        useBreadcrumb.setState(() => {
          return {
            breadcrumb: [
              {
                title: "Dashboard",
                href: "#",
              },
            ],
          };
        });
      },
    },
    {
      key: "Users",
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
          key: "User",
          label: "User",
          icon: (
            <img
              width="15"
              height="15"
              src="https://img.icons8.com/ios/50/user--v1.png"
              alt="user--v1"
            />
          ),
          onClick: () => {
            navigate("/user");
            localStorage.setItem(
              "breadcrumb",
              JSON.stringify([
                {
                  title: "Users",
                  href: "#",
                },
                {
                  title: "User",
                  href: "#",
                },
              ])
            );
            localStorage.setItem("selectedKey", JSON.stringify(["User"]));
            useBreadcrumb.setState(() => {
              return {
                breadcrumb: [
                  {
                    title: "Users",
                    href: "#",
                  },
                  {
                    title: "User",
                    href: "#",
                  },
                ],
              };
            });
          },
        },
        {
          key: "Voucher",
          label: "Voucher",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/windows/32/discount-ticket.png"
              alt="discount-ticket"
            />
          ),
          onClick: () => {
            navigate("/user");
            localStorage.setItem(
              "breadcrumb",
              JSON.stringify([
                {
                  title: "Users",
                  href: "#",
                },
                {
                  title: "Voucher",
                  href: "#",
                },
              ])
            );
            localStorage.setItem("selectedKey", JSON.stringify(["Voucher"]));
            useBreadcrumb.setState(() => {
              return {
                breadcrumb: [
                  {
                    title: "Users",
                    href: "#",
                  },
                  {
                    title: "Voucher",
                    href: "#",
                  },
                ],
              };
            });
          },
        },
      ],
    },
    {
      key: "Products",
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
          key: "Product",
          label: "Product",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/ios/50/product--v1.png"
              alt="product--v1"
            />
          ),
          onClick: () => {
            navigate("/product");
            localStorage.setItem(
              "breadcrumb",
              JSON.stringify([
                {
                  title: "Products",
                  href: "#",
                },
                {
                  title: "Product",
                  href: "#",
                },
              ])
            );
            localStorage.setItem("selectedKey", JSON.stringify(["Product"]));
            useBreadcrumb.setState(() => {
              return {
                breadcrumb: [
                  {
                    title: "Products",
                    href: "#",
                  },
                  {
                    title: "Product",
                    href: "#",
                  },
                ],
              };
            });
          },
        },
      ],
    },
    {
      key: "Services",
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
          key: "Service",
          label: "Service",
          icon: (
            <img
              className="w-[15px] h-[15px]"
              src="https://img.icons8.com/ios/50/service--v1.png"
              alt="service--v1"
            />
          ),
          onClick: () => {
            navigate("/service");
            localStorage.setItem(
              "breadcrumb",
              JSON.stringify([
                {
                  title: "Services",
                  href: "#",
                },
                {
                  title: "Service",
                  href: "#",
                },
              ])
            );
            localStorage.setItem("selectedKey", JSON.stringify(["Service"]));
            useBreadcrumb.setState(() => {
              return {
                breadcrumb: [
                  {
                    title: "Services",
                    href: "#",
                  },
                  {
                    title: "Service",
                    href: "#",
                  },
                ],
              };
            });
          },
        },
      ],
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  console.log(JSON.parse(localStorage.getItem("breadcrumb") || "[]"));

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
        defaultSelectedKeys={JSON.parse(
          localStorage.getItem("selectedKey") || "[]"
        )}
        defaultOpenKeys={["Users", "Products", "Services"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default Nav;
