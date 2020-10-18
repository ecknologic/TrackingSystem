import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { baseUrl } from '../config'
import { Row, Col, Input, Button, Select, Table, message, Space, Badge, Modal, Form, Checkbox } from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;


const Delivery = () => {
  const [visible, setVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [allDeliverys, setAllDeliverys] = useState([]);
  const [inputData, setInputData] = useState('');
  const [routesInfo, setRoutesInfo] = useState([]);


  useEffect(() => {
    getAllDeliverys();
    routesAlls();
  }, []);

  const getAllDeliverys = () => {
    axios.get(baseUrl + '/warehouse/deliveryDetails/2020-06-28')
      .then(res => {
        setAllDeliverys(res.data.data);
        setLoad(true);
      })
      .catch(err => {
        setLoad(true)
      })
  }

  const routesAlls = () => {
    axios.get(baseUrl + '/warehouse/getroutes')
      .then(response => {
        // message.success("Project Created Successfully")
        setRoutesInfo(response.data);
        console.log('Get ALL Routes Of house', response.data)
        // setUsersData(response.data.data)
      })
      .catch(error => {
        message.error("Error In creating balamudi", error)
        console.log(error)
      });
  }

  const createDc = () => {
    let createDcData = {
      "customerName": inputData.personShopName,
      "phoneNumber": inputData.phoneNumber,
      "address": inputData.shopAddress,
      "20LCans": inputData.twentyLiters,
      "1LBoxes": inputData.oneLiterBoxes,
      "500MLBoxes": inputData.fiveMlBoxes
    }
    axios.post(baseUrl + '/warehouse/createDC', createDcData)
      .then(response => {
        message.success("Project Created Successfully")
        console.log('balamudi', response)
        // setUsersData(response.data.data)
      })
      .catch(error => {
        message.error("Error In creating Task", error)
        console.log(error)
      });
  }

  const inputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value })
  }

  const dropDownChange = (e) => {

  }
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const columns = [
    {
      title: 'DC Number',
      dataIndex: 'dcnumber',
      key: 'dcnumber',
    },
    {
      title: 'Shop Address',
      dataIndex: 'shopAddress',
      key: 'shopAddress',
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Driver Name',
      key: 'driverName',
      dataIndex: 'driverName',
    },
    {
      title: 'Order Details',
      dataIndex: 'orderDetails',
      key: 'routeorderDetails',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },

    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a><MoreOutlined /></a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      dcnumber: 'DC - 26739',
      shopAddress: <div>
        <p>Sri Krishna Kiran Store</p>
        <span>429, HMT Sathavahana Nagar Rd, H….</span>
      </div>,
      route: 'Bachupally - Miyapur',
      driverName: ['Naryana Swamy'],
      orderDetails: ['20 ltrs -50', '1 ltr - 15 boxes',
        '500 ml - 20 boxes', '250 ml 56 Boxes'],
      status: <div>
        <p><span> <Badge color="#0edd4d" /></span> <span>Deliverd</span></p>
      </div>

    },
    {
      key: '2',
      dcnumber: 'DC - 26739',
      shopAddress: <div>
        <p>Sri Krishna Kiran Store</p>
        <span>429, HMT Sathavahana Nagar Rd, H….</span>
      </div>,
      route: 'Nizampet - Allwyn Colony',
      driverName: ['Naryana Swamy'],
      orderDetails: ['20 ltrs -50', '1 ltr - 15 boxes',
        '500 ml - 20 boxes', '250 ml 56 Boxes'],
      status: <div>
        <p><span><Badge color="#a10101" /></span> <span>Pending</span></p>
      </div>
    },
    {
      key: '3',
      dcnumber: 'DC - 26739',
      shopAddress: <div>
        <p>Sri Krishna Kiran Store</p>
        <span>429, HMT Sathavahana Nagar Rd, H….</span>
      </div>,
      route: 'Bachupally - Miyapur',
      driverName: ['Naryana Swamy'],
      orderDetails: ['20 ltrs -50', '1 ltr - 15 boxes',
        '500 ml - 20 boxes', '250 ml 56 Boxes'],
      status: <div>
        <p><span> <Badge color="#0edd4d" /></span> <span>Deliverd</span></p>
      </div>
    },
    {
      key: '4',
      dcnumber: 'DC - 26739',
      shopAddress: <div>
        <p>Sri Krishna Kiran Store</p>
        <span>429, HMT Sathavahana Nagar Rd, H….</span>
      </div>,
      route: 'Quthbullapur',
      driverName: ['Naryana Swamy'],
      orderDetails: ['20 ltrs -50', '1 ltr - 15 boxes',
        '500 ml - 20 boxes', '250 ml 56 Boxes'],
      status: <div>
        <p><span><Badge color="#a10101" /></span> <span>Pending</span></p>
      </div>
    },
  ];

  if (load) {
    return (
      <div>
        <div className="deliverycomp_filters">
          <Row>
            <Col span={6}>
              <Select className="deliveryCompMultiselect"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['a10', 'c12']}
                onChange={handleChange}
              >
                {children}
              </Select>
            </Col>
            <Col span={12}>
              <Button type="primary" className="createNewDcbtn" onClick={() => { setVisible(true) }}>
                <span><PlusOutlined /></span> <span>Create New DC</span>
              </Button>
            </Col>
            <Col span={6}>
              <Search className="deliveryCompSearchinput" placeholder="input search text" onSearch={value => console.log(value)} enterButton />
            </Col>
          </Row>
        </div>

        <div>
          <Table className="deliveryCompTable" columns={columns} dataSource={data} />
        </div>
        <div>
          <Modal className="createNewDCModal"
            title={<h3 className="deliverymodalheader">Create New DC</h3>}
            visible={visible}
            onOk={() => { setVisible(false) }}
            onCancel={() => { setVisible(false) }}
            footer={<div className="detailsmodalfooter"><Button type="primary" className="delivery_modalfoot_btn" onClick={() => createDc()}>Confirm Stock Received</Button></div>}
          >
            <div>
              <Form>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <h5 className="form_modal_label">Select Route</h5>
                      <Select defaultValue="Select Route" style={{ width: '100%' }} onChange={() => dropDownChange()}>
                        {routesInfo.length ? routesInfo.map((element, index) => (
                          <Option key={index} value={element.RouteId}>{element.RouteName}</Option>
                        )) : null}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={16} className="padding-right_comp">
                    <Form.Item>
                      <h5 className="form_modal_label">Person / Shop Name</h5>
                      <Input placeholder="Add Name" name="personShopName" value={inputData.personShopName} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item>
                      <h5 className="form_modal_label">Phone Number</h5>
                      <Input placeholder="789 -7700 " name="phoneNumber" value={inputData.phoneNumber} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <h5 className="form_modal_label">Shop Address</h5>
                      <Input placeholder="Add Address" name="shopAddress" value={inputData.shopAddress} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <h5 className="form_modal_label">Driver Name</h5>
                      <Select defaultValue="lucy" style={{ width: '100%' }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                          Disabled
                                            </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <h5>Stock Details </h5>
                  </Col>
                </Row>
                <Row>

                  <Col span={8} className="padding-right_comp">
                    <Form.Item>
                      <h5 className="form_modal_label">20 Ltrs</h5>
                      <Input placeholder="1500" name="twentyLiters" value={inputData.twentyLiters} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={5} className="padding-right_comp">
                    <Form.Item>
                      <h5 className="form_modal_label">1 Ltrs (Box-1x12)</h5>
                      <Input placeholder="1500" name="oneLiterBoxes" value={inputData.oneLiterBoxes} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={6} className="padding-right_comp">
                    <Form.Item>
                      <h5 className="form_modal_label">500 ml (Box-1x12)</h5>
                      <Input placeholder="1500" name="fiveMlBoxes" value={inputData.fiveMlBoxes} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item>
                      <h5 className="form_modal_label">250 ml (Box-1x12)</h5>
                      <Input placeholder="1500" name="twoFiveMLBoxes" value={inputData.twoFiveMLBoxes} onChange={inputChange} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading</h1>
      </div>)
  }
};

export default Delivery;