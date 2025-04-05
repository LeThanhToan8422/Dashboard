import { useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, Typography, theme } from "antd";
import { useOrderState } from "../../zustand/useOrderState";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TagOutlined,
  UserOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { orders, isLoading, fetchOrders } = useOrderState();
  const { token } = theme.useToken();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Basic Statistics
  const totalCarts = orders.length;
  const totalProducts = orders.reduce(
    (sum, order) => sum + order.totalProducts,
    0
  );
  const totalQuantity = orders.reduce(
    (sum, order) => sum + order.totalQuantity,
    0
  );
  const totalBeforeDiscount = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const totalAfterDiscount = orders.reduce(
    (sum, order) => sum + order.discountedTotal,
    0
  );
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  const averageDiscountPercentage = (totalDiscount / totalBeforeDiscount) * 100;

  // User Statistics
  const uniqueUsers = new Set(orders.map((order) => order.userId)).size;

  const userStats = orders.reduce((acc, order) => {
    if (!acc[order.userId]) {
      acc[order.userId] = {
        userId: order.userId,
        totalSpent: 0,
        totalProducts: 0,
      };
    }
    acc[order.userId].totalSpent += order.discountedTotal;
    acc[order.userId].totalProducts += order.totalProducts;
    return acc;
  }, {} as Record<number, { userId: number; totalSpent: number; totalProducts: number }>);

  const topSpendingUser = Object.values(userStats).reduce(
    (max, user) => (user.totalSpent > max.totalSpent ? user : max),
    { userId: 0, totalSpent: 0, totalProducts: 0 }
  );

  const topProductUser = Object.values(userStats).reduce(
    (max, user) => (user.totalProducts > max.totalProducts ? user : max),
    { userId: 0, totalSpent: 0, totalProducts: 0 }
  );

  // Product Statistics
  const productStats = orders.reduce(
    (acc, order) => {
      order.products.forEach((product) => {
        if (!acc[product.id]) {
          acc[product.id] = {
            id: product.id,
            title: product.title,
            totalQuantity: 0,
            totalRevenue: 0,
            totalDiscount: 0,
          };
        }
        acc[product.id].totalQuantity += product.quantity;
        acc[product.id].totalRevenue += product.price * product.quantity;
        acc[product.id].totalDiscount +=
          product.price * product.quantity -
          product.price *
            product.quantity *
            (order.total / order.discountedTotal);
      });
      return acc;
    },
    {} as Record<
      number,
      {
        id: number;
        title: string;
        totalQuantity: number;
        totalRevenue: number;
        totalDiscount: number;
      }
    >
  );

  const topQuantityProduct = Object.values(productStats).reduce(
    (max, product) =>
      product.totalQuantity > max.totalQuantity ? product : max,
    { id: 0, title: "", totalQuantity: 0, totalRevenue: 0, totalDiscount: 0 }
  );

  const topRevenueProduct = Object.values(productStats).reduce(
    (max, product) => (product.totalRevenue > max.totalRevenue ? product : max),
    { id: 0, title: "", totalQuantity: 0, totalRevenue: 0, totalDiscount: 0 }
  );

  const topDiscountProduct = Object.values(productStats).reduce(
    (max, product) =>
      product.totalDiscount > max.totalDiscount ? product : max,
    { id: 0, title: "", totalQuantity: 0, totalRevenue: 0, totalDiscount: 0 }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Title level={2} className="!mb-2">
          Dashboard Overview
        </Title>
        <Text type="secondary">Real-time statistics and analytics</Text>
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total Carts</Text>}
              value={totalCarts}
              prefix={
                <ShoppingCartOutlined style={{ color: token.colorPrimary }} />
              }
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total Products</Text>}
              value={totalProducts}
              prefix={
                <ShoppingOutlined style={{ color: token.colorSuccess }} />
              }
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total Quantity</Text>}
              value={totalQuantity}
              prefix={<TagOutlined style={{ color: token.colorWarning }} />}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Financial Statistics */}
      <Title level={4} className="mt-8 mb-4">
        Financial Overview
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total Before Discount</Text>}
              value={totalBeforeDiscount}
              prefix={<DollarOutlined style={{ color: token.colorInfo }} />}
              precision={2}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total After Discount</Text>}
              value={totalAfterDiscount}
              prefix={<DollarOutlined style={{ color: token.colorSuccess }} />}
              precision={2}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Total Discount</Text>}
              value={totalDiscount}
              prefix={<DollarOutlined style={{ color: token.colorError }} />}
              precision={2}
              valueStyle={{
                fontSize: "24px",
                fontWeight: "bold",
                color: token.colorError,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Average Discount %</Text>}
              value={averageDiscountPercentage}
              prefix={
                <PercentageOutlined style={{ color: token.colorSuccess }} />
              }
              precision={2}
              valueStyle={{
                fontSize: "24px",
                fontWeight: "bold",
                color: token.colorSuccess,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* User Statistics */}
      <Title level={4} className="mt-8 mb-4">
        User Analytics
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Unique Users</Text>}
              value={uniqueUsers}
              prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Top Spending User</Text>}
              value={topSpendingUser.totalSpent}
              prefix={<DollarOutlined style={{ color: token.colorSuccess }} />}
              suffix={
                <Text type="secondary">(User {topSpendingUser.userId})</Text>
              }
              precision={2}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "20px" }}>
            <Statistic
              title={<Text strong>Top Product User</Text>}
              value={topProductUser.totalProducts}
              prefix={
                <ShoppingOutlined style={{ color: token.colorWarning }} />
              }
              suffix={
                <Text type="secondary">(User {topProductUser.userId})</Text>
              }
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Product Statistics */}
      <Title level={4} className="mt-8 mb-4">
        Product Performance
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<Text strong>Top Quantity Product</Text>}
            className="hover:shadow-lg transition-shadow duration-300">
            <Text strong className="block mb-2">
              {topQuantityProduct.title}
            </Text>
            <Statistic
              value={topQuantityProduct.totalQuantity}
              prefix={
                <ShoppingOutlined style={{ color: token.colorPrimary }} />
              }
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<Text strong>Top Revenue Product</Text>}
            className="hover:shadow-lg transition-shadow duration-300">
            <Text strong className="block mb-2">
              {topRevenueProduct.title}
            </Text>
            <Statistic
              value={topRevenueProduct.totalRevenue}
              prefix={<DollarOutlined style={{ color: token.colorSuccess }} />}
              precision={2}
              valueStyle={{ fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title={<Text strong>Top Discount Product</Text>}
            className="hover:shadow-lg transition-shadow duration-300">
            <Text strong className="block mb-2">
              {topDiscountProduct.title}
            </Text>
            <Statistic
              value={topDiscountProduct.totalDiscount}
              prefix={<DollarOutlined style={{ color: token.colorError }} />}
              precision={2}
              valueStyle={{
                fontSize: "20px",
                fontWeight: "bold",
                color: token.colorError,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Title level={4} className="mt-8 mb-4">
        Visual Analytics
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<Text strong>Revenue Distribution</Text>}
            className="hover:shadow-lg transition-shadow duration-300">
            <Pie
              data={[
                { type: "After Discount", value: totalAfterDiscount },
                { type: "Discount Amount", value: totalDiscount },
              ]}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: "outer",
                content: "{name} {percentage}",
              }}
              legend={{
                layout: "horizontal",
                position: "bottom",
              }}
              color={[token.colorSuccess, token.colorError]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<Text strong>Cart Value Distribution</Text>}
            className="hover:shadow-lg transition-shadow duration-300">
            <Column
              data={orders.map((order) => ({
                cartId: `Cart ${order.id}`,
                value: order.discountedTotal,
              }))}
              xField="cartId"
              yField="value"
              label={{
                position: "middle",
                style: { fill: "#FFFFFF" },
              }}
              color={token.colorPrimary}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
