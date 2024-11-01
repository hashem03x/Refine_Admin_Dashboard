import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List, Space } from "antd";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useList } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import dayjs from "dayjs";
import CustomAvatar from "../CustomAvatar";

function LatestActivites() {
  const {
    data: audit,
    isLoading: isLoadingAudit,
    error: AuditError,
    isError,
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });

  const dealIds = audit?.data.map((audit) => audit.targetId);
  const {
    data: deals,
    isLoading: isLoadingDeals,
    error: DealsError,
  } = useList({
    resource: "deals",
    queryOptions: { enabled: !!dealIds?.length },
    pagination: { mode: "off" },
    filters: [
      {
        field: "id",
        operator: "in",
        value: dealIds,
      },
    ],
    meta: { gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY },
  });

  if (isError) {
    console.log(DealsError || AuditError);
    return null;
  }

  const isLoading = isLoadingAudit || isLoadingDeals;

  return (
    <Card
      style={{ width: "100%" }}
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Latest Activites
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={(_, i) => <LatestActivitiesSkeleton key={i} />}
        ></List>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audit.data}
          renderItem={(item) => {
            const deal = deals?.data.find(
              (deal) => deal.id == item.targetId || undefined
            );

            return (
              <List.Item>
                <List.Item.Meta
                  title={dayjs(deal?.createdAt).format("MMMM DD, YYYY - HH:mm")}
                  avatar={
                    <CustomAvatar
                      shape="circle"
                      size={48}
                      src={deal?.company.avatarUrl}
                      name={deal?.company.name}
                    />
                  }
                  description={
                    <Space size={4}>
                      <Text strong>{item.user?.name}</Text>
                      <Text>
                        {item.action === "CREATE" ? "Created" : "Moved"}
                      </Text>
                      <Text strong>{deal?.title} </Text>
                      <Text>deal </Text>
                      <Text>{item.action === "CREATE" ? "In" : "To"}</Text>
                      <Text strong>{deal?.stage?.title}</Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        ></List>
      )}
    </Card>
  );
}

export default LatestActivites;
