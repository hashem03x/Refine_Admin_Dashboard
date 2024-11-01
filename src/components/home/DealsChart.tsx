import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../text";

import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { useMemo } from "react";
import { mapDealsData } from "@/utilities/helpers";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

function DealsChart() {
  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
    filters: [
      {
        field: "title",
        operator: "in",
        value: ["WON", "LOST"],
      },
    ],
  });

  const dealData = useMemo(() => {
    return mapDealsData(data?.data);
  }, [data]);
  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    seriesField: "state",
    animation: true,
    isStack: false,
    startOnZero: false,
    smooth: true,
    legend: { offsetY: -6 },
    yAxis: {
      tickCount: 4,
      label: {
        formatter: (v: string) => {
          return `${Number(v) / 1000}K EGP`;
        },
      },
    },
  };

  return (
    <Card
      style={{ height: "100%", width: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DollarOutlined />
          <Text strong size="sm" style={{ marginLeft: "0.7rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      <Area {...config} height={325} />
    </Card>
  );
}

export default DealsChart;
