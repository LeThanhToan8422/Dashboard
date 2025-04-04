import { useEffect } from "react";
import { Table, Tag, Image, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useOrderState } from "../../zustand/useOrderState";
import type { Order, Product } from "../../../services/orderService";
const Order = () => {
  const { orders, isLoading, fetchOrders } = useOrderState();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products: Product[]) => (
        <div className="space-y-2">
          {products.map((product: Product) => (
            <div key={product.id} className="flex items-center space-x-2">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={50}
                height={50}
                className="object-cover"
              />
              <div>
                <div className="font-medium">{product.title}</div>
                <div className="text-sm text-gray-500">
                  Qty: {product.quantity} x ${product.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Total Products",
      dataIndex: "totalProducts",
      key: "totalProducts",
      render: (total) => <Tag color="blue">{total}</Tag>,
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      render: (total) => <Tag color="green">{total}</Tag>,
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      render: (total, record) => (
        <div>
          <div className="text-red-500 line-through">${total}</div>
          <div className="text-green-500">${record.discountedTotal}</div>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col border-1 border-[#f0f0f0] rounded-tr-[10px] rounded-tl-[10px]">
        <div className="w-full h-[60px] border-b-1 border-[#f0f0f0] flex flex-row justify-between items-center px-[10px]">
          <span className="font-bold text-[20px]">ORDERS</span>
        </div>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
    </div>
  );
};

export default Order;
