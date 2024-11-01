import { Text } from "@/components/text";
import { PlusOutlined } from "@ant-design/icons";
import { useDroppable, UseDroppableArguments } from "@dnd-kit/core";
import { Badge, Button, Space } from "antd";
import { ReactNode } from "react";

type Props = {
  id: string;
  data?: UseDroppableArguments["data"];
  title: string;
  count: number;
  description?: ReactNode;
  onAddClick?: (args: { id: string }) => void;
};

function KanbanColumn({
  children,
  id,
  title,
  count,
  onAddClick,
  data,
  description,
}: React.PropsWithChildren<Props>) {
  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data,
  });
  const onAddClickHandler = () => {
    onAddClick?.({ id });
  };

  console.log("count", count);
  return (
    <div
      ref={setNodeRef}
      style={{ display: "flex", flexDirection: "column", padding: "0 16px" }}
    >
      <div style={{ padding: "12px" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Text
              ellipsis={{ tooltip: title }}
              size="xs"
              strong
              style={{ textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              {title}
            </Text>
            {!!count && (
              <Badge count={count} color="cyan" style={{ marginLeft: "4px" }} />
            )}
          </Space>
          <Button
            icon={<PlusOutlined />}
            shape="circle"
            onClick={() => onAddClickHandler()}
          />
        </Space>
        {description}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: active ? "unset" : "auto",
          border: "2px dashed transparent",
          borderColor: isOver ? "#000040" : "transparent",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default KanbanColumn;
