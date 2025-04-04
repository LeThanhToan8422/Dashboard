import React, { useEffect } from "react";
import type { FormInstance } from "antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useUserState, UserData } from "../../../zustand/useUserState";
import dayjs from "dayjs";

interface UserFormProps {
  form: FormInstance<UserData>;
  uuidKey: string;
}

const UserForm: React.FC<UserFormProps> = ({ form, uuidKey }) => {
  const user = useUserState((state) => state.user);
  const currentFeature = useUserState((state) => state.currentFeature);

  useEffect(() => {
    if (currentFeature !== "create" && user) {
      const formValues = { ...user };
      if (formValues.birthDate) {
        formValues.birthDate = dayjs(formValues.birthDate);
      }
      if (typeof formValues.image === "string") {
        formValues.image = [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: formValues.image,
          },
        ] as UploadFile[];
      }
      form.setFieldsValue(formValues);
    }
  }, [form, user, currentFeature]);

  const onValuesChange = (changedValues: Partial<UserData>) => {
    const values = form.getFieldsValue();
    if (values.image && Array.isArray(values.image) && values.image[0]) {
      const fileInfo = values.image[0] as UploadFile;
      if (fileInfo.originFileObj) {
        values.image = URL.createObjectURL(fileInfo.originFileObj as Blob);
      } else {
        values.image = fileInfo.url || "";
      }
    }
    if (values.birthDate) {
      if (typeof values.birthDate !== "string") {
        values.birthDate = values.birthDate.format("YYYY-MM-DD");
      }
    }

    useUserState.setState((state) => ({
      user: {
        ...(state.user || {}),
        ...values,
        ...changedValues,
        key: currentFeature === "create" ? uuidKey : state.user.key,
      },
    }));
  };

  const normFile = (e: { fileList: UploadFile[] } | UploadFile[]) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form<UserData>
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      disabled={currentFeature === "view"}
      className="max-h-[60vh] overflow-y-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please input first name!" }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please input last name!" }]}>
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input username!" }]}>
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}>
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please input phone number!" }]}>
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="Birth Date"
          rules={[{ required: true, message: "Please select birth date!" }]}>
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}>
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}>
          <Select placeholder="Select role">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="moderator">Moderator</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Form.Item
          name={["hair", "color"]}
          label="Hair Color"
          rules={[{ required: true, message: "Please input hair color!" }]}>
          <Input placeholder="Enter hair color" />
        </Form.Item>

        <Form.Item
          name={["hair", "type"]}
          label="Hair Type"
          rules={[{ required: true, message: "Please input hair type!" }]}>
          <Input placeholder="Enter hair type" />
        </Form.Item>

        <Form.Item
          name="eyeColor"
          label="Eye Color"
          rules={[{ required: true, message: "Please input eye color!" }]}>
          <Input placeholder="Enter eye color" />
        </Form.Item>

        <Form.Item
          name="height"
          label="Height (cm)"
          rules={[{ required: true, message: "Please input height!" }]}>
          <InputNumber className="w-full" min={0} max={300} />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Weight (kg)"
          rules={[{ required: true, message: "Please input weight!" }]}>
          <InputNumber className="w-full" min={0} max={500} />
        </Form.Item>

        <Form.Item
          name="bloodGroup"
          label="Blood Group"
          rules={[{ required: true, message: "Please input blood group!" }]}>
          <Select placeholder="Select blood group">
            <Select.Option value="A+">A+</Select.Option>
            <Select.Option value="A-">A-</Select.Option>
            <Select.Option value="B+">B+</Select.Option>
            <Select.Option value="B-">B-</Select.Option>
            <Select.Option value="O+">O+</Select.Option>
            <Select.Option value="O-">O-</Select.Option>
            <Select.Option value="AB+">AB+</Select.Option>
            <Select.Option value="AB-">AB-</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <div className="border-t border-gray-200 my-4 pt-4">
        <h3 className="font-medium mb-4">Address Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name={["address", "address"]}
            label="Street Address"
            rules={[
              { required: true, message: "Please input street address!" },
            ]}>
            <Input placeholder="Enter street address" />
          </Form.Item>

          <Form.Item
            name={["address", "city"]}
            label="City"
            rules={[{ required: true, message: "Please input city!" }]}>
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item
            name={["address", "state"]}
            label="State"
            rules={[{ required: true, message: "Please input state!" }]}>
            <Input placeholder="Enter state" />
          </Form.Item>

          <Form.Item
            name={["address", "postalCode"]}
            label="Postal Code"
            rules={[{ required: true, message: "Please input postal code!" }]}>
            <Input placeholder="Enter postal code" />
          </Form.Item>

          <Form.Item
            name={["address", "country"]}
            label="Country"
            rules={[{ required: true, message: "Please input country!" }]}>
            <Input placeholder="Enter country" />
          </Form.Item>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4 pt-4">
        <h3 className="font-medium mb-4">Company Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name={["company", "name"]}
            label="Company Name"
            rules={[{ required: true, message: "Please input company name!" }]}>
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item
            name={["company", "department"]}
            label="Department"
            rules={[{ required: true, message: "Please input department!" }]}>
            <Input placeholder="Enter department" />
          </Form.Item>

          <Form.Item
            name={["company", "title"]}
            label="Job Title"
            rules={[{ required: true, message: "Please input job title!" }]}>
            <Input placeholder="Enter job title" />
          </Form.Item>
        </div>
      </div>

      <Form.Item
        name="image"
        label="Profile Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please upload an image!" }]}>
        <Upload
          name="image"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
