import React from "react";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { getNameInitials } from "../utilities";

type Props = AvatarProps & {
  name: string;
};
function CustomAvatar({ name, style, ...rest }: Props) {
  return (
    <AntdAvatar
      alt="Micheal Scott"
      size="small"
      style={{
        backgroundColor: "#87d068",
        display: "flex",
        alignItems: "center",
        border: "none",
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {getNameInitials(name || "")}
    </AntdAvatar>
  );
}

export default CustomAvatar;
