import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableProduct from "./tables/TableProduct";
import ProductModal from "./modals/ProductModal";
import { useProductState } from "../../zustand/useProductState";

const Product: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchProducts = useProductState((state) => state.fetchProducts);
  const isLoading = useProductState((state) => state.isLoading);
  const error = useProductState((state) => state.error);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showModal = () => {
    useProductState.setState({
      product: null,
      currentFeature: "create",
    });
    setIsModalOpen(true);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col border-1 border-[#f0f0f0] rounded-tr-[10px] rounded-tl-[10px]">
        <div className="w-full h-[60px] border-b-1 border-[#f0f0f0] flex flex-row justify-between items-center px-[10px]">
          <span className="font-bold text-[20px]">Product</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="flex items-center">
            Create product
          </Button>
          <ProductModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : (
          <TableProduct setIsModalOpen={setIsModalOpen} />
        )}
      </div>
    </div>
  );
};

export default Product;
