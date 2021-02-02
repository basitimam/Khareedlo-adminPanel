import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Row, Col, Icon, Popconfirm, Input } from "antd";
import PropTypes from "prop-types";
import memoize from "memoize-one";
import { getAllOrders, deleteOrder } from "../../services/order.services";
import { Button, SearchInput } from "components/Shared";
import { setOrderLoader } from "../../actions/order.action";
import { openModal } from "../../actions/modal.action";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class OrderTableContainer extends Component {
  // PropTypes
  static propTypes = {
    getAllUsers: PropTypes.func,
    openModal: PropTypes.func,
    setUserLoader: PropTypes.func,
    loading: PropTypes.bool,
    allUsers: PropTypes.array,
  };

  constructor(props) {
    super(props);
    // Initial State
    this.state = {
      dataSource: [],
      loading: this.props.loading,
      tableHeight: 500,
      searchValue: "",
      isModalOpen: false,
      modalDataSource: [],
      filterTable: null,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  orderDetails = async (record) => {
    let orders = [];
    for (let i = 0; i < record.items.length; i++) {
      orders.push(record.items[i]);
    }

    await this.setState({
      modalDataSource: orders,
    });

    console.log(orders);

    this.toggleModal();
  };

  static getDerivedStateFromProps(props, state) {
    if (props.loading !== state.loading) {
      return {
        loading: props.loading,
      };
    }
    return null;
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
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
    if (!this.props.allOrders) {
      this.props.setOrderLoader(true);

      return new Promise((resolve, reject) => {
        this.props.getAllOrders(resolve, reject);
      })
        .then(() => {
          this.props.setOrderLoader(false);
          this.setState({
            dataSource: [...this.props.allOrders],
          });
        })
        .catch(() => {
          this.props.setOrderLoader(false);
        });
    } else {
      this.setState({
        dataSource: [...this.props.allOrders],
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
    this.props.setOrderLoader(true);
    try {
      return new Promise((resolve, reject) => {
        this.props.deleteOrder(record, resolve, reject);
      })
        .then(() => {
          this.setState(() => {
            this.props.setOrderLoader(false);
          });
          alert("The Order has been deleted!");
        })
        .catch((err) => {
          this.props.setOrderLoader(false);
          console.log("cannot delete");
        });
    } catch (error) {
      console.log(error);
      this.props.setOrderLoader(false);
    }
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

  orderTable() {
    const columns = [
      {
        title: "Product Name",
        dataIndex: ["product", "name"],
        width: 250,
      },
      {
        title: "Category",
        dataIndex: "product.category.name",
      },
      {
        title: "Product Price",
        dataIndex: "product.price",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={this.state.modalDataSource}
        pagination={false}
      />
    );
  }

  search = (value) => {
    const { dataSource } = this.state;
    // console.log("PASS", { value });

    // console.log(dataSource);

    const filterTable = dataSource.filter((o) =>
      Object.keys(o.user).some((k) =>
        String(o.user[k])
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );

    this.setState({ filterTable });
  };

  render() {
    if (this.props.allOrders && this.props.allOrders.length > 0) {
      this.filterIt(this.props.allOrders, this.state.searchValue);
    }

    // Columns
    const columns = [
      {
        title: "Customer Name",
        dataIndex: ["user", "name"],
        width: 250,
      },
      {
        title: "Email",
        dataIndex: "user.email",
      },
      {
        title: "Total amount",
        dataIndex: "price",
      },
      {
        title: "Total Orders",
        dataIndex: "items.length",
      },
      {
        title: "Show Orders",
        key: "operation",
        width: 100,
        // fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Popconfirm
                title="Are you sure you want to update this product?"
                onConfirm={() => this.orderDetails(record)}
              >
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Icon
                    style={{
                      alignSelf: "center",
                      cursor: "pointer",
                      fontSize: "1.7em",
                      color: "rgb(255,143,143)",
                      padding: 4,
                      background: "#efeded",
                      borderRadius: 25,
                      boxShadow: "1px 1px 1px rgba(0,0,0,0.3)",
                    }}
                    type="user-delete"
                  />
                </div>
              </Popconfirm>
            </>
          );
        },
      },
      {
        title: "Delete",
        key: "operation",
        width: 100,
        // fixed: 'right',
        render: (text, record) => {
          return (
            <>
              <Popconfirm
                title="Are you sure you want to delete?"
                onConfirm={() => this.onRecordDelete(record)}
              >
                <div style={{ width: "100%", textAlign: "center" }}>
                  <Icon
                    style={{
                      alignSelf: "center",
                      cursor: "pointer",
                      fontSize: "1.7em",
                      color: "rgb(255,143,143)",
                      padding: 4,
                      background: "#efeded",
                      borderRadius: 25,
                      boxShadow: "1px 1px 1px rgba(0,0,0,0.3)",
                    }}
                    type="user-delete"
                  />
                </div>
              </Popconfirm>
            </>
          );
        },
      },
    ];

    return (
      <div>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Order Details</ModalHeader>
          <ModalBody>{this.orderTable()}</ModalBody>
        </Modal>
        <Input.Search
          style={{ border: "3px solid white", margin: "0 0 10px 0" }}
          placeholder="Search by..."
          enterButton
          onSearch={this.search}
        />
        <Table
          columns={columns}
          dataSource={
            this.state.filterTable == null
              ? this.state.dataSource
              : this.state.filterTable
          }
          bordered
          size="middle"
          loading={this.state.loading}
          scroll={{ y: this.state.tableHeight }}
          pagination={false}
          // onChange={this.handleChange}
          rowKey={(record) => record.id}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allOrders: state.order.allorders,
    loading: state.order.loading,
  };
};

export default connect(mapStateToProps, {
  getAllOrders,
  setOrderLoader,
  openModal,
  deleteOrder,
})(OrderTableContainer);
