import React from "react";
import { Modal } from "antd";
import ProductForm from "../forms/ProductForm";
import {
  ProductState,
  useProductState,
} from "../../../zustand/useProductState";

interface ProductModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const currentFeature = useProductState(
    (state: ProductState) => state.currentFeature
  );
  const addProduct = useProductState((state: ProductState) => state.addProduct);
  const updateProduct = useProductState(
    (state: ProductState) => state.updateProduct
  );

  const handleCancel = () => {
    setIsModalOpen(false);
    useProductState.setState({
      product: null,
      currentFeature: null,
    });
  };

  const handleOK = () => {
    if (currentFeature === "create") {
      addProduct();
    } else if (currentFeature === "update") {
      updateProduct();
    }
    setIsModalOpen(false);
  };

  const getTitle = () => {
    switch (currentFeature) {
      case "create":
        return "Create Product";
      case "update":
        return "Update Product";
      case "view":
        return "View Product";
      default:
        return "Product";
    }
  };

  return (
    <Modal
      title={getTitle()}
      open={isModalOpen}
      okText="Save"
      onOk={handleOK}
      onCancel={handleCancel}
      destroyOnClose>
      <ProductForm isModalOpen={isModalOpen} />
    </Modal>
  );
};

export default ProductModal;
