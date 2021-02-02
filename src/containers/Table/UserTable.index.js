import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Popconfirm } from "antd";
import PropTypes from "prop-types";
import memoize from "memoize-one";
import { getAllUsers } from "../../services/user.services";
import { setUserLoader } from "../../actions/user.action";
import { openModal } from "../../actions/modal.action";

class UserTableContainer extends Component {
  // PropTypes
  static propTypes = {
    getAllUsers: PropTypes.func,
    openModal: PropTypes.func,
    setUserLoader: PropTypes.func,
    loading: PropTypes.bool,
    allUsers: PropTypes.array,
  };

  // Initial State
  state = {
    dataSource: [],
    loading: this.props.loading,
    tableHeight: 500,
    searchValue: "",
  };

  static getDerivedStateFromProps(props, state) {
    if (props.loading !== state.loading) {
      return {
        loading: props.loading,
      };
    }
    return null;
  }

  componentDidMount() {
    this.getTableData();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  // Handles the resize.
  handleResize = () => {
    this.setState({
      tableHeight: window.innerHeight - 300,
    });
  };

  getTableData = () => {
    if (!this.props.allUsers) {
      this.props.setUserLoader(true);

      return new Promise((resolve, reject) => {
        this.props.getAllUsers(resolve, reject);
      })
        .then(() => {
          this.props.setUserLoader(false);
          this.setState({
            dataSource: this.props.allUsers,
          });
        })
        .catch(() => {
          this.props.setUserLoader(false);
        });
    } else {
      this.setState({
        dataSource: this.props.allUsers,
      });
    }
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  // Deletes a record.
  onRecordDelete = (record) => {
    this.props.setUserLoader(true);
    let newSource = this.state.dataSource.filter(
      (user) => user.id !== record.id
    );
    this.setState({ dataSource: newSource }, () => {
      this.props.setUserLoader(false);
    });
  };

  filterIt = memoize((arr, searchKey) => {
    const list = arr.filter((obj) =>
      Object.keys(obj).some((key) =>
        key + "" !== "key" && key + "" !== "id"
          ? (obj[key] + "").toLowerCase().includes(searchKey.toLowerCase())
          : null
      )
    );
    if (list !== this.state.dataSource) {
      this.setState({
        dataSource: list,
      });
    }
  });

  onSearch = (text) => {
    this.setState({
      searchValue: text,
    });
  };

  render() {
    if (this.props.allUsers && this.props.allUsers.length > 0) {
      this.filterIt(this.props.allUsers, this.state.searchValue);
    }

    // Columns
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: 250,
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Address",
        dataIndex: "address.streetaddress",
      },
      {
        title: "PhoneNumber",
        dataIndex: "phonenumber",
      },
      {
        title: "Role",
        dataIndex: "role",
      },
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          bordered
          size="middle"
          loading={this.state.loading}
          scroll={{ y: this.state.tableHeight }}
          pagination={false}
          onChange={this.handleChange}
          rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allUsers: state.users.allUsers,
    loading: state.users.loading,
  };
};

export default connect(mapStateToProps, {
  getAllUsers,
  setUserLoader,
  openModal,
})(UserTableContainer);
