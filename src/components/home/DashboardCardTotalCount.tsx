import { totalCountVariants } from "@/constants";
import { Card, Skeleton } from "antd";
import { Text } from "../text";
import { Area } from "@ant-design/plots";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount: number;
};
function DashboardCardTotalCount({ resource, isLoading, totalCount }: Props) {
  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];
  const config = {
    data: totalCountVariants[resource].data,
    xField: "index",
    yField: "value",
    xAxis: false,
    yAxis: {
      tickCount: 12,
      label: {
        style: {
          stroke: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    line: {
      color: primaryColor,
    },
    areaStyle: () => {
      return {
        fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
      };
    },
    smooth: true,
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncviewpadding: true,
    autofit: true,
    animation: false,
    tooltip: false,
  };
  return (
    <Card
      style={{ height: "96px", padding: "0" }}
      bodyStyle={{ padding: "8px 8px 8px 12px" }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "40px",
          }}
        >
          {isLoading ? (
            <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
          ) : (
            totalCount
          )}
        </Text>
        {isLoading ? (
          <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
        ) : (
          <Area {...config} style={{ width: "50%" }} />
        )}
      </div>
    </Card>
  );
}

export default DashboardCardTotalCount;
