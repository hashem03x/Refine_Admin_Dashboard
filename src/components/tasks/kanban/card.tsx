import CustomAvatar from "@/components/CustomAvatar";
import { Text } from "@/components/text";
import { TextIcon } from "@/components/textIcon";
import { User } from "@/graphql/schema.types";
import { getDateColor } from "@/utilities";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Space,
  Tag,
  theme,
  Tooltip,
} from "antd";
import { MenuProps } from "antd/lib";
import dayjs from "dayjs";
import { memo, useMemo } from "react";

type Props = {
  id?: string;
  title: string;
  dueDate?: string;
  updatedAt?: string;
  users?: {
    id: string;
    avatarUrl?: User["avatarUrl"];
    name: string;
  }[];
};

function TaskCard({ id, title, dueDate, users }: Props) {
  const { token } = theme.useToken();

  const { edit } = useNavigation();

  const dropdownItems = useMemo(() => {
    const dropdownItems: MenuProps["items"] = [
      {
        label: "View Card",
        key: "1",
        icon: <EyeOutlined />,
        onClick: () => {
          edit("tasks", id, "replace");
        },
      },
      {
        danger: true,
        label: "Delete Card",
        key: "2",
        icon: <DeleteOutlined />,
        onClick: () => {},
      },
    ];

    return dropdownItems;
  }, []);

  const dueDateOptions = useMemo(() => {
    if (!dueDate) return null;
    const date = dayjs(dueDate);

    return {
      color: getDateColor({ date: dueDate }) as string,
      text: date.format("MMM DD"),
    };
  }, [dueDate]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: { colorText: token.colorTextSecondary },
          Card: { headerBg: "transparent" },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: { title } }}>{title}</Text>}
        onClick={() => edit("tasks", id, "replace")}
        extra={
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => e.stopPropagation(),
              onClick: (e) => e.domEvent.stopPropagation(),
            }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            ></Button>
          </Dropdown>
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TextIcon style={{ marginRight: "4px" }} />
          {dueDateOptions && (
            <Tag
              icon={<ClockCircleOutlined style={{ fontSize: "12px" }} />}
              style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor:
                  dueDateOptions.color === "default" ? "transparent" : "unset",
              }}
              color={dueDateOptions.color}
              bordered={dueDateOptions.color !== "default"}
            >
              {dueDateOptions.text}
            </Tag>
          )}
          {!!users?.length && (
            <Space
              size={4}
              wrap
              direction="horizontal"
              align="center"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginLeft: "auto",
                marginRight: "0",
              }}
            >
              {users?.map((user) => (
                <Tooltip key={user.id} title={user.name}>
                  <CustomAvatar src={user.avatarUrl} name={user.name} />
                </Tooltip>
              ))}
            </Space>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
}

export default TaskCard;

export const TaskCardMemo = memo(TaskCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.dueDate === next.dueDate &&
    prev.users?.length === next.users?.length &&
    prev.updatedAt === next.updatedAt
  );
});
