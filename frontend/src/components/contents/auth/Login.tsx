import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthState } from "../../zustand/useAuthState";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isLoading, isAuthenticated, getCurrentUser } = useAuthState();
  const navigate = useNavigate();
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
        message.success("Login successful!");
        navigate("/");
      } else {
        message.success("Login failed!");
      }
    } catch (err) {
      console.log(err);
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={isLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
