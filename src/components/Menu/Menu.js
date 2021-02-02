import React from "react";
import { Menu, Icon } from "antd";
import PropTypes from "prop-types";

// Sider Menu Component
const SideMenu = ({ onMenuSelect }) => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["1"]}
      onSelect={({ key }) => {
        onMenuSelect(key);
      }}
      selectedKeys={[window.location.pathname]}
    >
      {/* <Menu.Item key="/dashboard">
        <Icon type="pie-chart" />
        <span>Dashboard</span>
      </Menu.Item> */}
      <Menu.Item key="/dashboard/users">
        <Icon type="table" />
        <span>Users</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/products">
        <Icon type="table" />
        <span>Products</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/orders">
        <Icon type="table" />
        <span>Orders</span>
      </Menu.Item>
      {/* <Menu.Item key="/dashboard/charts">
        <Icon type="line-chart" />
        <span>Charts</span>
      </Menu.Item> */}
    </Menu>
  );
};

SideMenu.propTypes = {
  onMenuSelect: PropTypes.func,
};

export default SideMenu;
