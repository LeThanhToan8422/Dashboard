import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthState } from "../../zustand/useAuthState";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

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
        toast.success("🦄 Login successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        navigate("/");
      } else {
        toast.error("🦄 Username or password incorrect.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("🦄 Login failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
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
