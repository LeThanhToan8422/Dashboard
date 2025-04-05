import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message, theme } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthState } from "../../zustand/useAuthState";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated, getCurrentUser } = useAuthState();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [accessToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (accessToken) {
      if (!isAuthenticated) {
        getCurrentUser();
      }
      navigate("/");
    }
  }, [accessToken, navigate, getCurrentUser, isAuthenticated]);

  const onFinish = async (values: LoginForm) => {
    try {
      await login(values);
      if (useAuthState.getState().isAuthenticated) {
        messageApi.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        messageApi.error("Login failed!");
      }
    } catch (err) {
      console.log(err);
      messageApi.error("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {contextHolder}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card
          className="w-[400px] shadow-xl rounded-lg overflow-hidden"
          bodyStyle={{ padding: "40px" }}>
          <div className="text-center mb-8">
            <Title level={2} className="!mb-2">
              Welcome Back
            </Title>
            <Text type="secondary">Please sign in to continue</Text>
          </div>

          <Form
            name="login"
            initialValues={{
              username: "emilys",
              password: "emilyspass",
            }}
            onFinish={onFinish}
            layout="vertical"
            size="large">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}>
              <Input
                prefix={<UserOutlined style={{ color: token.colorPrimary }} />}
                placeholder="Username"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: token.colorPrimary }} />}
                placeholder="Password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 rounded-lg text-lg font-medium"
                loading={isLoading}
                style={{
                  background: `linear-gradient(to right, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                  border: "none",
                  boxShadow: `0 4px 12px ${token.colorPrimary}40`,
                }}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <Text type="secondary">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-primary-dark">
                Sign up
              </a>
            </Text>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
