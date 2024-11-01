import { Button, Popover } from "antd";
import React, { useState } from "react";
import CustomAvatar from "../CustomAvatar";
import { useGetIdentity } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";
import { Text } from "../text";
import { SettingOutlined } from "@ant-design/icons";
import { AccountSettings } from "./AccountSettings";
function CurrentUser() {
  const { data: user } = useGetIdentity<User>();
  const [isOpen, setIsOpen] = useState(false);

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text strong style={{ padding: "12px 20px", textAlign: "center" }}>
        {user?.name || "username"}
      </Text>
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "12px",
          width: "100%",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          type="text"
          block
          icon={<SettingOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Account Settings
        </Button>
      </div>
    </div>
  );
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayStyle={{ zIndex: 999 }}
        overlayInnerStyle={{ padding: 0 }}
        content={content}
      >
        <CustomAvatar
          name={user?.name || "username"}
          style={{ cursor: "pointer" }}
          src={user?.avatarUrl}
          size="default"
        />
      </Popover>
      {user && isOpen && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={user.id}
        />
      )}
    </>
  );
}

export default CurrentUser;
