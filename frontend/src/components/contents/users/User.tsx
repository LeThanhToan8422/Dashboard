import { Button } from "antd";
import TableUser from "./tables/TableUser";

const User = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col border-1 border-[#f0f0f0] rounded-tr-[10px] rounded-tl-[10px]">
        <div className="w-full h-[60px] border-b-1 border-[#f0f0f0] flex flex-row justify-between items-center px-[10px]">
          <span className="font-bold text-[20px]">USER</span>
          <Button type="primary">Create user</Button>
        </div>
        <TableUser />
      </div>
    </div>
  );
};

export default User;
