import React from "react";
import CustomAvatar from "./CustomAvatar";
import { Text } from "./text";

type Props = {
  name: string;
  avatarUrl?: string;
  shape?: "circle" | "square";
};

function SelectOptionWithAvatar({ name, avatarUrl, shape }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
      }}
    >
      <CustomAvatar name={name} src={avatarUrl} shape={shape} />
      <Text style={{ marginLeft: "8px" }}>{name}</Text>
    </div>
  );
}

export default SelectOptionWithAvatar;
