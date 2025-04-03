import { Button, Modal, Form } from "antd";
import TableUser from "./tables/TableUser";
import { useRef, useState } from "react";
import { FieldType } from "./forms/UserForm";
import { useUserState } from "../../zustand/useUserState";
import UserForm from "./forms/UserForm";
import { v4 as uuidv4 } from "uuid";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<FieldType>();
  const { currentFeature, addUser, updateUser } = useUserState();
  const uuidRef = useRef("");

  const showModal = () => {
    uuidRef.current = uuidv4();
    form.resetFields();
    setIsModalOpen(true);
    useUserState.setState(() => ({
      currentFeature: "create",
    }));
  };

  const handleOk = () => {
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
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col border-1 border-[#f0f0f0] rounded-tr-[10px] rounded-tl-[10px]">
        <div className="w-full h-[60px] border-b-1 border-[#f0f0f0] flex flex-row justify-between items-center px-[10px]">
          <span className="font-bold text-[20px]">USER</span>
          <Button type="primary" onClick={showModal}>
            Create user
          </Button>
          <Modal
            title="User Modal"
            okText={"Save"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <UserForm form={form} uuidKey={uuidRef.current} />
          </Modal>
        </div>
        <TableUser setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
};

export default User;
