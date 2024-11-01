import CustomAvatar from "@/components/CustomAvatar";
import SelectOptionWithAvatar from "@/components/SelectOptionWithAvatar";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from "@/constants";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { CompanyContactsTable } from "./ContactsTable";

function EditPage() {
  const { queryResult, formLoading, formProps, saveButtonProps } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {};
  const { selectProps, queryResult: queryResultUsers } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    pagination: { mode: "off" },
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });
  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{ width: 96, height: 96, marginBottom: 16 }}
              />
              <Form.Item
                label="Sales Owner"
                initialValue={queryResult?.data?.data.salesOwnerId}
                name="salesOwnerId"
              >
                <Select
                  {...selectProps}
                  placeholder="Please Select a Sales owner"
                  options={queryResultUsers?.data?.data.map((user) => ({
                    value: user.id,
                    label: (
                      <SelectOptionWithAvatar
                        name={user.name}
                        avatarUrl={user.avatarUrl || undefined}
                        shape="circle"
                      />
                    ),
                  }))}
                />
              </Form.Item>
              <Form.Item label="Company Size">
                <Select options={companySizeOptions} />
              </Form.Item>
              <Form.Item label="Total Revenue">
                <InputNumber
                  addonBefore="EGP"
                  placeholder="0,00"
                  min={0}
                  autoFocus
                />
              </Form.Item>
              <Form.Item label="Industry">
                <Select options={industryOptions} />
              </Form.Item>
              <Form.Item label="Bussines Type">
                <Select options={businessTypeOptions} />
              </Form.Item>
              <Form.Item label="Country" name="country">
                <Input placeholder="Country" />
              </Form.Item>
              <Form.Item label="Website" name="website">
                <Input placeholder="Website" />
              </Form.Item>
            </Form>
          </Edit>
        </Col>
        <Col xs={24} lg={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  );
}

export default EditPage;
