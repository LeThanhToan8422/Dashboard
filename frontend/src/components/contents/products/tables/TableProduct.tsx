import React, { useRef, useState } from "react";
import {
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType } from "antd";
import {
  Button,
  Input,
  Space,
  Table,
  Dropdown,
  Tag,
  Image,
  Tooltip,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { Key } from "rc-table/lib/interface";
import type { UploadFile } from "antd/es/upload/interface";
import Highlighter from "react-highlight-words";
import {
  ProductState,
  useProductState,
} from "../../../zustand/useProductState";

interface DataType {
  key: string;
  name: string;
  status: "active" | "inactive";
  image: string | UploadFile[];
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
}

interface TableProductProps {
  setIsModalOpen: (value: boolean) => void;
}

const TableProduct: React.FC<TableProductProps> = ({ setIsModalOpen }) => {
  const data = useProductState((state: ProductState) => state.products);
  const deleteProduct = useProductState(
    (state: ProductState) => state.deleteProduct
  );
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: keyof DataType
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: keyof DataType) => ({
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
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filter
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
    onFilter: (value: boolean | Key, record: DataType) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase()) ?? false,
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "key",
      render: (key: string) => key.split("-")[0],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      ...getColumnSearchProps("category"),
      sorter: (a, b) => (a.category ?? "").localeCompare(b.category ?? ""),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width: "10%",
      ...getColumnSearchProps("brand"),
      sorter: (a, b) => (a.brand ?? "").localeCompare(b.brand ?? ""),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price?: number, record?: DataType) => (
        <Tooltip
          title={
            record?.discountPercentage
              ? `${record.discountPercentage}% off`
              : ""
          }>
          <Space>
            <DollarOutlined />
            <span>{price?.toFixed(2)}</span>
            {record?.discountPercentage && (
              <Tag color="red">{record.discountPercentage}% OFF</Tag>
            )}
          </Space>
        </Tooltip>
      ),
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status: "active" | "inactive", record?: DataType) => (
        <Space direction="vertical" size="small">
          <Tag color={status === "active" ? "success" : "error"}>
            {status.toUpperCase()}
          </Tag>
          {record?.stock !== undefined && (
            <Tag color={record.stock > 10 ? "blue" : "orange"}>
              Stock: {record.stock}
            </Tag>
          )}
        </Space>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: "10%",
      render: (rating?: number) => (
        <Tag color={rating && rating > 4.5 ? "gold" : "blue"}>
          ⭐ {rating?.toFixed(1)}
        </Tag>
      ),
      sorter: (a, b) => (a.rating ?? 0) - (b.rating ?? 0),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (image: string | UploadFile[]) => (
        <Image
          src={typeof image === "string" ? image : image[0].url}
          alt="product"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <EyeOutlined style={{ color: "#1890ff" }} />,
                label: <span style={{ color: "#1890ff" }}>View Details</span>,
                onClick: () => {
                  useProductState.setState(() => ({
                    product: record,
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
                  useProductState.setState(() => ({
                    product: record,
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
                  useProductState.setState(() => ({
                    product: record,
                    currentFeature: "delete",
                  }));
                  deleteProduct();
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
    <Table<DataType>
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 6,
      }}
    />
  );
};

export default TableProduct;
