import React from "react";
import { CompanyListPage } from "./List";
import { Form, Input, Modal, Select } from "antd";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { CREATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import SelectOptionWithAvatar from "@/components/SelectOptionWithAvatar";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { UsersSelectQuery } from "@/graphql/types";

function Create() {
  const go = useGo();

  const goToListPage = () => {
    go({
      to: { resource: "companies", action: "list" },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const { modalProps, formProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "companies",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });

  const { selectProps, queryResult } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  console.log(queryResult?.data?.data);

  return (
    <CompanyListPage>
      <Modal
        {...modalProps}
        mask={true}
        onCancel={goToListPage}
        title="Create Company"
        width={512}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Company Name"
            rules={[{ required: true }]}
            name="name"
          >
            <Input placeholder="Please Enter a Company name" />
          </Form.Item>
          <Form.Item
            label="Sales Owner"
            rules={[{ required: true }]}
            name="salesOwnerId"
          >
            <Select
              {...selectProps}
              placeholder="Please Select a Sales owner"
              options={queryResult?.data?.data.map((user) => ({
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
        </Form>
      </Modal>
    </CompanyListPage>
  );
}

export default Create;
