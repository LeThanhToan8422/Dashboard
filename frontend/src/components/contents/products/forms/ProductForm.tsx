import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import {
  ProductData,
  ProductState,
  useProductState,
} from "../../../zustand/useProductState";

interface ProductFormProps {
  isModalOpen: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ isModalOpen }) => {
  const [form] = Form.useForm<ProductData>();
  const product = useProductState((state: ProductState) => state.product);
  const currentFeature = useProductState(
    (state: ProductState) => state.currentFeature
  );

  useEffect(() => {
    if (isModalOpen) {
      if (currentFeature !== "create" && product) {
        const formValues = { ...product };
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
    }
  }, [form, isModalOpen, currentFeature, product]);

  const onValuesChange = (changedValues: Partial<ProductData>) => {
    const values = form.getFieldsValue();
    if (values.image && Array.isArray(values.image) && values.image[0]) {
      const fileInfo = values.image[0] as UploadFile;
      if (fileInfo.originFileObj) {
        values.image = URL.createObjectURL(fileInfo.originFileObj as Blob);
      } else {
        values.image = fileInfo.url || "";
      }
    }

    useProductState.setState((state) => ({
      product: {
        ...(state.product || {}),
        ...values,
        ...changedValues,
      },
    }));
  };

  const normFile = (e: UploadChangeParam<UploadFile>) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form<ProductData>
      form={form}
      layout="vertical"
      onValuesChange={onValuesChange}
      disabled={currentFeature === "view"}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the product name!" }]}>
        <Input placeholder="Enter product name" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description!" }]}>
        <Input.TextArea rows={4} placeholder="Enter product description" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please input the category!" }]}>
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please input the brand!" }]}>
          <Input placeholder="Enter brand" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please input the price!" }]}>
          <InputNumber
            className="w-full"
            min={0}
            precision={2}
            prefix="$"
            placeholder="Enter price"
          />
        </Form.Item>

        <Form.Item
          name="discountPercentage"
          label="Discount (%)"
          rules={[{ required: true, message: "Please input the discount!" }]}>
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            precision={2}
            placeholder="Enter discount"
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please input the stock!" }]}>
          <InputNumber
            className="w-full"
            min={0}
            precision={0}
            placeholder="Enter stock"
          />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: "Please input the rating!" }]}>
          <InputNumber
            className="w-full"
            min={0}
            max={5}
            precision={2}
            placeholder="Enter rating"
          />
        </Form.Item>
      </div>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select the status!" }]}>
        <Select placeholder="Select status">
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="image"
        label="Image"
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

export default ProductForm;
