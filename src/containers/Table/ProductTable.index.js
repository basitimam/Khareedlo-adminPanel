import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Table, Row, Col, Popconfirm, DatePicker, Checkbox, Icon } from "antd";
import PropTypes from "prop-types";
import memoize from "memoize-one";
import { Button, SearchInput } from "../../components/Shared";
import {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "services/product.services";
import { setProductLoader } from "actions/product.action";
import { openModal } from "actions/modal.action";
import category from "../../reducers/category";
import Item from "antd/lib/list/Item";
import ReactFilestack from "filestack-react";

class ProductTableContainer extends Component {
  // PropTypes
  static propTypes = {
    getAllProducts: PropTypes.func,
    openModal: PropTypes.func,
    setProductLoader: PropTypes.func,
    loading: PropTypes.bool,
    allproducts: PropTypes.array,
    allcategories: PropTypes.array,
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
      isUpdateModalOpen: false,
      categories: [],
      productImage: null,
      recordObj: null,
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.onSubmitProduct = this.onSubmitProduct.bind(this);
    this.onRecordUpdate = this.onRecordUpdate.bind(this);
    this.UpdatetoggleModal = this.UpdatetoggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  UpdatetoggleModal() {
    this.setState({
      isUpdateModalOpen: !this.state.isUpdateModalOpen,
    });
  }

  addProductDetails = async (data) => {
    this.props.setProductLoader(true);
    new Promise((resolve, reject) => {
      this.props.addProduct(data, resolve, reject);
    }).then(() => {
      this.props.setProductLoader(false);
    });
  };

  async onSubmitProduct(event) {
    this.toggleModal();
    event.preventDefault();

    const values = {
      name: this.name.value,
      quantity: this.quantity.value,
      price: this.price.value,
      expiry: this.expiry.value,
      category: null,
      featured: this.featured.checked,
      imagePath: this.state.productImage,
    };

    switch (this.category.value.toLowerCase()) {
      case "vegetable": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "vegetable"
        );
        values.category = category[0]._id;
        break;
      }
      case "fruit": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "fruit"
        );
        values.category = category[0]._id;
        break;
      }
      case "juice": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "juice"
        );
        values.category = category[0]._id;
        break;
      }
      case "dried": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "dried"
        );
        values.category = category[0]._id;
        break;
      }
    }

    //API CALL
    try {
      await this.addProductDetails(values);
      setTimeout(() => {}, 300);
    } catch (error) {
      console.log(error);
    }
  }

  // showModal = () => {
  //   this.setState({ showModal: true });
  // };

  // handleOk = (e) => {
  //   console.log(e);
  //   this.setState({ showModal: false });
  // };

  // handleCancel = (e) => {
  //   console.log(e);
  //   this.setState({ showModal: false });
  // };

  static getDerivedStateFromProps(props, state) {
    if (props.loading !== state.loading) {
      return {
        loading: props.loading,
      };
    }
    return null;
  }

  // Search + Add Button
  static TableHeader = ({ searchValue, onSearch, onAdd }) => {
    return (
      <Row style={{ paddingTop: 15, paddingBottom: 15 }}>
        <Col span={6}>
          <SearchInput
            placeholder="input search text"
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            value={searchValue}
          />
        </Col>
      </Row>
    );
  };

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
    if (!this.props.allproducts) {
      this.props.setProductLoader(true);
      return new Promise((resolve, reject) => {
        this.props.getAllProducts(resolve, reject);
      })
        .then(() => {
          this.props.setProductLoader(false);
          this.setState({
            dataSource: [...this.props.allproducts],
            categories: [...this.props.allcategories],
          });
        })
        .catch((err) => {
          console.log(err);
          this.props.setProductLoader(false);
        });
    } else {
      this.setState({
        dataSource: this.props.allproducts,
        // categories: this.props.allcategories,
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
    this.props.setProductLoader(true);
    try {
      return new Promise((resolve, reject) => {
        this.props.deleteProduct(record, resolve, reject);
      })
        .then(() => {
          this.setState(() => {
            this.props.setProductLoader(false);
          });
          alert("The product has been deleted!");
        })
        .catch((err) => {
          this.props.setProductLoader(false);
          console.log("cannot delete");
        });
    } catch (error) {
      console.log(error);
      this.props.setProductLoader(false);
    }
  };

  // Updates a record.
  onRecordUpdate = async (record) => {
    await this.setState({
      recordObj: record,
    });

    this.UpdatetoggleModal();
  };

  onSubmitUpdate = (event) => {
    this.UpdatetoggleModal();
    event.preventDefault();

    const values = {
      _id: this.state.recordObj._id,
      name: this.name.value,
      quantity: this.quantity.value,
      price: this.price.value,
      expiry: this.expiry.value,
      category: null,
      featured: this.featured.checked,
      imagePath: this.state.recordObj.imagePath,
    };

    if (this.state.productImage) {
      values.imagePath = this.state.productImage;
    }

    switch (this.category.value.toLowerCase()) {
      case "vegetable": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "vegetable"
        );
        values.category = category[0]._id;
        break;
      }
      case "fruit": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "fruit"
        );
        values.category = category[0]._id;
        break;
      }
      case "juice": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "juice"
        );
        values.category = category[0]._id;
        break;
      }
      case "dried": {
        let category = this.state.categories.filter(
          (category) => category.name.toLowerCase() === "dried"
        );
        values.category = category[0]._id;
        break;
      }
    }

    this.props.setProductLoader(true);

    try {
      return new Promise((resolve, reject) => {
        this.props.updateProduct(values, resolve, reject);
      })
        .then(() => {
          alert("The product has been updated!");
          this.props.setProductLoader(false);
        })
        .catch((err) => {
          this.props.setProductLoader(false);
          console.log("cannot update the product");
        });
    } catch (error) {
      console.log(error);
      this.props.setProductLoader(false);
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

  onFinish = (values) => {
    console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  //FILE STACK CALL BACKS

  onSuccess = (result) => {
    this.setState({ productImage: result.filesUploaded[0].url });
  };

  onError = (error) => {
    console.error("error", error);
  };

  basicOptions = {
    accept: "image/*",
    fromSources: ["local_file_system"],
    // maxSize: 1024 * 1024,
    maxFiles: 1,
  };

  updateModal = (record) => {
    if (record) {
      return (
        <Modal
          isOpen={this.state.isUpdateModalOpen}
          toggle={this.UpdatetoggleModal}
        >
          <ModalHeader toggle={this.UpdatetoggleModal}>
            Update Product
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmitUpdate}>
              <FormGroup>
                <Input
                  name="name"
                  placeholder="Product Name"
                  defaultValue={record.name}
                  innerRef={(input) => (this.name = input)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  name="price"
                  placeholder="Price"
                  defaultValue={record.price}
                  innerRef={(input) => (this.price = input)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  name="quantity"
                  placeholder="Quantity"
                  defaultValue={record.quantity}
                  innerRef={(input) => (this.quantity = input)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="datetime"
                  name="expiry"
                  placeholder="Expiry"
                  defaultValue={record.expiry}
                  innerRef={(input) => (this.expiry = input)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  name="category"
                  innerRef={(input) => (this.category = input)}
                >
                  <option value="fruit">Fruit</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="dried">Dried</option>
                  <option value="juice">Juice</option>
                </Input>
              </FormGroup>
              <FormGroup check row>
                <Col md={4} offset={1}>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="featured"
                      defaultValue={record.featured}
                      innerRef={(input) => (this.featured = input)}
                    />
                    Featured
                  </Label>
                </Col>
                <Col md={5}>
                  <Button
                    type="submit"
                    color="primary"
                    htmlType="submit"
                    label="ADD "
                  />
                </Col>
                <Col md={6}>
                  <ReactFilestack
                    apikey="AyEaBL87SDKWdJFskiF6zz"
                    buttonText="Upload Photo"
                    buttonClass="ui medium button "
                    options={this.basicOptions}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      );
    }
  };

  render() {
    if (this.props.allproducts && this.props.allproducts.length > 0) {
      this.filterIt(this.props.allproducts, this.state.searchValue);
    }

    // Columns
    const columns = [
      {
        title: "Product Name",
        dataIndex: "name",
        width: 250,
      },
      {
        title: "Price",
        dataIndex: "price",
        width: 150,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
      },
      {
        title: "Category",
        dataIndex: "category.name",
      },
      {
        title: "Update",
        key: "operation",
        width: 100,
        // fixed: 'right',
        render: (text, record) => {
          return (
            <>
              {this.updateModal(this.state.recordObj)}
              <Popconfirm
                title="Are you sure you want to update this product?"
                onConfirm={() => this.onRecordUpdate(record)}
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
        <>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Add new Product</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmitProduct}>
                <FormGroup>
                  <Input
                    name="name"
                    placeholder="Product Name"
                    innerRef={(input) => (this.name = input)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="price"
                    placeholder="Price"
                    innerRef={(input) => (this.price = input)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="quantity"
                    placeholder="Quantity"
                    innerRef={(input) => (this.quantity = input)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="datetime"
                    name="expiry"
                    placeholder="Expiry"
                    innerRef={(input) => (this.expiry = input)}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="select"
                    name="category"
                    id="category"
                    innerRef={(input) => (this.category = input)}
                  >
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="dried">Dried</option>
                    <option value="juice">Juice</option>
                  </Input>
                </FormGroup>
                <FormGroup check row>
                  <Col md={4} offset={1}>
                    <Label check>
                      <Input
                        type="checkbox"
                        name="featured"
                        innerRef={(input) => (this.featured = input)}
                      />
                      Featured
                    </Label>
                  </Col>
                  <Col md={5}>
                    <Button
                      type="submit"
                      color="primary"
                      htmlType="submit"
                      label="ADD "
                    />
                  </Col>
                  <Col md={6}>
                    <ReactFilestack
                      apikey="AyEaBL87SDKWdJFskiF6zz"
                      buttonText="Upload Photo"
                      buttonClass="ui medium button "
                      options={this.basicOptions}
                      onSuccess={this.onSuccess}
                      onError={this.onError}
                    />
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
          <Row style={{ paddingTop: 15, paddingBottom: 15 }}>
            <Col span={6} />
            <Col
              span={4}
              offset={14}
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
                display: "flex",
              }}
            >
              <Button
                type="primary"
                iconType="plus"
                hasIcon={true}
                label="Add New Product"
                onClick={this.toggleModal}
              />
            </Col>
          </Row>
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
        </>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allproducts: state.products.allproducts,
    loading: state.products.loading,
    allcategories: state.category.allCategories,
  };
};

export default connect(mapStateToProps, {
  getAllProducts,
  setProductLoader,
  addProduct,
  deleteProduct,
  updateProduct,
  openModal,
})(ProductTableContainer);
