import React, { useRef, useState } from "react";
import {
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  BankOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType } from "antd";
import {
  Button,
  Input,
  Space,
  Table,
  Dropdown,
  Tag,
  Avatar,
  Tooltip,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { Key } from "rc-table/lib/interface";
import Highlighter from "react-highlight-words";
import { useUserState, UserData } from "../../../zustand/useUserState";

type DataIndex = keyof UserData;

interface TableUserProps {
  setIsModalOpen: (value: boolean) => void;
}

const TableUser: React.FC<TableUserProps> = ({ setIsModalOpen }) => {
  const data = useUserState((state) => state.users);
  const deleteUser = useUserState((state) => state.deleteUser);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: keyof UserData
  ): TableColumnsType<UserData>[number] => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: boolean | Key, record: UserData) => {
      const key = dataIndex as keyof UserData;
      const fieldValue = record[key];

      if (!fieldValue) return false;

      if (typeof fieldValue === "object") {
        return JSON.stringify(fieldValue)
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      }

      return fieldValue
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<UserData> = [
    {
      title: "ID",
      dataIndex: "key",
      width: "5%",
      render: (key: string) => key,
    },
    {
      title: "User Info",
      dataIndex: "firstName",
      width: "25%",
      ...getColumnSearchProps("firstName"),
      render: (_, record) => (
        <Space>
          <Avatar
            src={
              typeof record.image === "string"
                ? record.image
                : record.image[0]?.url
            }
            icon={<UserOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Space>
              <span className="font-medium">
                {record.firstName} {record.lastName}
              </span>
              <Tag
                color={
                  record.role === "admin"
                    ? "red"
                    : record.role === "moderator"
                    ? "blue"
                    : "default"
                }>
                {record.role.toUpperCase()}
              </Tag>
            </Space>
            <span className="text-gray-500">@{record.username}</span>
          </Space>
        </Space>
      ),
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
    },
    {
      title: "Contact",
      dataIndex: "email",
      width: "25%",
      ...getColumnSearchProps("email"),
      render: (_, record) => (
        <Space direction="vertical" size={1}>
          <Space>
            <MailOutlined /> {record.email}
          </Space>
          <Space>
            <PhoneOutlined /> {record.phone}
          </Space>
        </Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "address",
      width: "25%",
      render: (address) => (
        <Tooltip
          title={`${address.city}, ${address.state}, ${address.country}`}>
          <Space>
            <HomeOutlined />
            <span>{address.address}</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: "Company",
      dataIndex: "company",
      width: "15%",
      render: (company) => (
        <Tooltip title={`${company.department} - ${company.title}`}>
          <Space>
            <BankOutlined />
            <span>{company.name}</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "5%",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined style={{ color: "#1890ff" }} />,
                label: <span style={{ color: "#1890ff" }}>View Details</span>,
                onClick: () => {
                  useUserState.setState(() => ({
                    user: record,
                    currentFeature: "view",
                  }));
                  setIsModalOpen(true);
                },
              },
              {
                key: "2",
                icon: <EditOutlined style={{ color: "#52c41a" }} />,
                label: <span style={{ color: "#52c41a" }}>Edit</span>,
                onClick: () => {
                  useUserState.setState(() => ({
                    user: record,
                    currentFeature: "update",
                  }));
                  setIsModalOpen(true);
                },
              },
              {
                key: "3",
                icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
                label: <span style={{ color: "#ff4d4f" }}>Delete</span>,
                onClick: () => {
                  useUserState.setState(() => ({
                    user: record,
                    currentFeature: "delete",
                  }));
                  deleteUser();
                },
              },
            ],
          }}
          trigger={["hover"]}>
          <Button
            type="text"
            icon={
              <MoreOutlined style={{ fontSize: "20px", color: "#595959" }} />
            }
            style={{
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s",
            }}
            className="hover:bg-[#f0f0f0]"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <Table<UserData>
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 6,
      }}
    />
  );
};

export default TableUser;
