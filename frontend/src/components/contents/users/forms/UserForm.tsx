import React, { useEffect } from "react";
import type { FormProps, FormInstance } from "antd";
import { Form, Input, InputNumber } from "antd";
import { useUserState } from "../../../zustand/useUserState";

export type FieldType = {
  name?: string;
  age?: number;
  address?: string;
};

interface UserModalProps {
  form: FormInstance<FieldType>;
  uuidKey: string;
}

const UserForm: React.FC<UserModalProps> = ({ form, uuidKey }) => {
  const user = useUserState((state) => state.user);
  const currentFeature = useUserState((state) => state.currentFeature);

  useEffect(() => {
    if (currentFeature !== "create") {
      form.setFieldsValue({
        name: user.name,
        age: user.age,
        address: user.address,
      });
    }
  }, [form, user, currentFeature]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onValuesChange = (changedValues: Partial<FieldType>) => {
    useUserState.setState((state) => ({
      user: {
        ...state.user,
        ...changedValues,
        key: currentFeature === "create" ? uuidKey : state.user.key,
      },
    }));
  };
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      autoComplete="off"
      layout="horizontal"
      className="p-4"
      disabled={
        useUserState.getState().currentFeature === "view" ? true : false
      }>
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}>
        <Input placeholder="Enter your name" className="rounded-md" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Age"
        name="age"
        rules={[{ required: true, message: "Please input your age!" }]}>
        <InputNumber
          className="w-full rounded-md"
          placeholder="Enter your age"
          min={1}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item<FieldType>
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your Address!" }]}>
        <Input.TextArea
          placeholder="Enter your address"
          className="rounded-md"
          rows={3}
        />
      </Form.Item>
    </Form>
  );
};

export default UserForm;
