import { Button, Modal, Form, Spin } from "antd";
import TableUser from "./tables/TableUser";
import { useRef, useState, useEffect } from "react";
import { useUserState, UserData } from "../../zustand/useUserState";
import UserForm from "./forms/UserForm";
import { v4 as uuidv4 } from "uuid";
import { PlusOutlined } from "@ant-design/icons";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<UserData>();
  const {
    currentFeature,
    resetUser,
    addUser,
    updateUser,
    fetchUsers,
    isLoading,
    error,
  } = useUserState();
  const uuidRef = useRef("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getTitle = () => {
    switch (currentFeature) {
      case "create":
        return "Create User";
      case "update":
        return "Update User";
      case "view":
        return "View User";
      default:
        return "User";
    }
  };

  const showModal = () => {
    uuidRef.current = uuidv4();
    useUserState.setState(() => ({
      currentFeature: "create",
    }));
    form.resetFields();
    setIsModalOpen(true);
    resetUser();
  };

  const handleOk = () => {
    console.log(currentFeature);

    if (currentFeature === "create") {
      addUser();
    } else if (currentFeature === "update") {
      updateUser();
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col border-1 border-[#f0f0f0] rounded-tr-[10px] rounded-tl-[10px]">
        <div className="w-full h-[60px] border-b-1 border-[#f0f0f0] flex flex-row justify-between items-center px-[10px]">
          <span className="font-bold text-[20px]">USER</span>
          <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
            Create user
          </Button>
          <Modal
            title={getTitle()}
            okText={"Save"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <UserForm form={form} uuidKey={uuidRef.current} />
          </Modal>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spin size="large" />
          </div>
        ) : (
          <TableUser setIsModalOpen={setIsModalOpen} />
        )}
      </div>
    </div>
  );
};

export default User;
