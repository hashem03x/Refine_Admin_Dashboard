import React from "react";
import CurrentUser from "./CurrentUser";
import { Layout } from "antd";

function Header() {
  const headerStyles: React.CSSProperties = {
    backgroundColor: "white",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "sticky",
    top: "0",
  };
  return (
    <Layout.Header style={headerStyles}>
      <CurrentUser />
    </Layout.Header>
  );
}

export default Header;
