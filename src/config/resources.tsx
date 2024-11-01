import { DashboardOutlined, ShopOutlined } from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: { icon: <DashboardOutlined />, label: "Dashboard" },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: { label: "Companies", icon: <ShopOutlined /> },
  },
  {
    name: "tasks",
    list: "/tasks",
    show: "/tasks/",
    create: "/tasks/new",
    edit: "/tasks/edit/:id",
    meta: { label: "tasks", icon: <ShopOutlined /> },
  },
];
