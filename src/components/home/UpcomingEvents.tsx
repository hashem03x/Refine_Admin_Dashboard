import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List } from "antd";
import React from "react";
import { Text } from "../text";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import { useList } from "@refinedev/core";
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries";
import { getDate } from "@/utilities/helpers";
import dayjs from "dayjs";

function UpcomingEvents() {
  const { data, isLoading } = useList({
    resource: "events",
    pagination: { pageSize: 5 },
    sorters: [
      {
        field: "startDate",
        order: "asc",
      },
    ],
    // filters: [
    //   {
    //     field: "startDate",
    //     operator: "gte",
    //     value: dayjs().format("YYYY-MM-DD"),
    //   },
    // ],
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });

  return (
    <Card
      style={{ height: "100%", width: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0 24px" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined />
          <Text strong size="sm" style={{ marginLeft: "0.7rem" }}>
            Upcoming Events
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            return (
              <List.Item>
                <List.Item.Meta
                  title={<Text size="xs">{renderDate}</Text>}
                  avatar={<Badge color={item.color} />}
                  description={
                    <Text
                      ellipsis={{ tooltip: true }}
                      style={{ fontWeight: "bold" }}
                      strong
                    >
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
      {!isLoading && data?.data?.length === 0 && (
        <Text style={{ display: "flex", justifyContent: "center" }}>
          No upcoming events
        </Text>
      )}
    </Card>
  );
}

export default UpcomingEvents;
