import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Button, Select, Table, message, Badge, Modal, Menu, Spin, Dropdown, } from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { createOrUpdateAPI, getAPI } from '../utils/apis';
import { checkValidation } from '../utils/validations';
import CreateDCModal from './Delivery/modalComponent'
import { editData } from '../utils/Functions'
import { columns } from './Delivery/tableData';
import Spinner from '../components/Spinner';
import NoContent from '../components/NoContent';
const { Search } = Input;
const { Option } = Select;


const Delivery = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoad] = useState(true);
  const [allDeliverys, setAllDeliverys] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [inputData, setInputData] = useState({
    personShopName: '', phoneNumber: '', shopAddress: '', twentyLiters: '', oneLiterBoxes: '', fiveMlBoxes: '', twoFiveMLBoxes: ''
  });
  const [routesInfo, setRoutesInfo] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState('')
  const [driversData, setDriversData] = useState([])
  const [driverId, setDriverId] = useState('')
  const [routeId, setRouteId] = useState('')
  const [errors, setErrors] = useState({})
  const [disabled, setDisabled] = useState(false)
  const [customerOrderId, setCustomerOrderId] = useState('')
  const warehouseId = sessionStorage.getItem('warehouseId') || 1;
  const date = props.currentDate

  useEffect(() => {
    getRoutes();
  }, []);
  useEffect(() => {
    getAllDeliverys();
  }, [props.currentDate])

  const getAllDeliverys = () => {
    setLoad(true);
    getAPI('/warehouse/deliveryDetails/' + date)
      .then(res => {
        setAllDeliverys(res);
        setDeliveryDetails(res)
        setLoad(false);
      })
  }

  const getRoutes = () => {
    getAPI('/warehouse/getroutes')
      .then(response => {
        setRoutesInfo(response);
      })
  }
  const getDriversList = () => {
    getAPI('/warehouse/getdriverDetails/' + warehouseId)
      .then(response => {
        setDriversData(response);
      })
  }
  const createOrUpdateDc = () => {
    let { personShopName, phoneNumber, shopAddress, twentyLiters, oneLiterBoxes, fiveMlBoxes, twoFiveMLBoxes } = inputData
    checkValidation({
      personShopName, phoneNumber, shopAddress, twentyLiters, oneLiterBoxes, fiveMlBoxes, twoFiveMLBoxes, routeId, driverId
    }).then(errors => {
      setErrors(errors)
      if (Object.keys(errors).length === 0) {
        let createDcData = {
          customerName: inputData.personShopName,
          phoneNumber: inputData.phoneNumber,
          address: inputData.shopAddress,
          routeId,
          driverId,
          Cans20L: inputData.twentyLiters,
          Boxes1L: inputData.oneLiterBoxes,
          Boxes500ML: inputData.fiveMlBoxes,
          Boxes250ML: inputData.twoFiveMLBoxes,
          warehouseId: sessionStorage.getItem('warehouseId') || 1,
          customerOrderId: customerOrderId != '' ? customerOrderId : undefined
        }
        if (customerOrderId == '') {
          createOrUpdateAPI('warehouse/createDC', createDcData, "POST")
            .then(response => {
              if (response.status === 200 && response.data.length) {
                message.success(response.message)
                setVisible(false)
                let createItem = [...deliveryDetails, response.data[0]]
                setDeliveryDetails(createItem)
              } else message.error(response.message)
            })
            .catch(error => {
              message.error("Error In creating DC", error)
            });
        } else {
          createOrUpdateAPI('warehouse/updateDC', createDcData, "PUT")
            .then(response => {
              if (response.status === 200 && response.data.length) {
                message.success(response.message)
                setVisible(false)
                editData(response.data[0], deliveryDetails, 'customerOrderId').then(dataUpdated => {
                  setDeliveryDetails(dataUpdated)
                })
              } else message.error(response.message)
            })
            .catch(error => {
              message.error("Error In updating DC", error)
            });
        }
      }
    })
  }

  const inputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value })
  }

  const dropDownChange = (e, key) => {
    if (key == 'routeId') setRouteId(e)
  }
  const children = routesInfo.length && routesInfo.map(route => <Option key={route.RouteId} value={route.RouteId}>{route.RouteName}</Option>);
  const driversList = driversData.length && driversData.map(driver => <Option key={driver.driverId} value={driver.driverId}>{driver.driverName}</Option>)

  function handleChange(value, key) {
    if (key == "driverId") setDriverId(value)
    else if (key === 'selectedRoutes') {
      if (!value.length) setDeliveryDetails(allDeliverys)
      else if (allDeliverys.length) {
        let arr = []
        allDeliverys.map(delivery => {
          if (value.includes(delivery.routeId)) {
            arr.push(delivery)
          }
          return false
        })
        setDeliveryDetails(arr)
      }
      setSelectedRoutes(value)
    }
  }

  const onMenuSelect = (e, dcItem) => {
    if (e.key == 'view' || e.key == 'edit') {
      getDriversList()
      // if (e.key == 'view') setDisabled(true)
      setVisible(true)
      ViewOrEditData(dcItem)
    }
  }
  const ViewOrEditData = (delivery) => {
    const { customerName, phoneNumber, address, twentyLCans, OneLBoxes, fiveHLBoxes, twofiftyLBoxes, routeId, driverId, customerOrderId } = delivery;
    console.log(routeId, driverId)
    setRouteId(routeId)
    setCustomerOrderId(customerOrderId)
    setDriverId(driverId)
    setInputData({ ...inputData, personShopName: customerName, phoneNumber, shopAddress: address, twentyLiters: twentyLCans, oneLiterBoxes: OneLBoxes, fiveMlBoxes: fiveHLBoxes, twoFiveMLBoxes: twofiftyLBoxes })
  }
  const onOk = () => {
    setVisible(false);
    setCustomerOrderId('')
    if (disabled) setDisabled(false)
  }
  const onCancel = () => {
    setVisible(false);
    setCustomerOrderId('')
    if (disabled) setDisabled(false)
  }
  const data = deliveryDetails.length && deliveryDetails.map((delivery, index) => {
    return {
      key: index,
      dcnumber: delivery.dcNo,
      shopAddress: <div>
        <p>{delivery.address}</p>
      </div>,
      route: delivery.RouteName,
      driverName: delivery.driverName,
      orderDetails: ["1LBoxes" + "-" + delivery['1LBoxes'] + ", ", "20LCans" + "-" + delivery['20LCans'] + ", ", "500MLBoxes" + "-" + delivery['500MLBoxes']
        //  + ", ", "250MLBoxes" + "-" + delivery['250MLBoxes']
      ],
      status: <div>
        {delivery.isDelivered ? <p><span> <Badge color="#0edd4d" /></span> <span>Delivered</span></p>
          : <p><span><Badge color="#a10101" /></span> <span>Pending</span></p>}
      </div>,
      action: <Dropdown getPopupContainer={triggerNode => triggerNode.parentNode}
        overlay={(<Menu onClick={(e) => onMenuSelect(e, delivery)} >
          <Menu.Item key="edit">View/Edit</Menu.Item>
          {/* <Menu.Item key="view" >View</Menu.Item> */}
          <Menu.Item key="changeRoute">Change Route</Menu.Item>
          <Menu.Item key="invoice">Generate Invoice</Menu.Item>
        </Menu>)}
        trigger={['click']} overlayClassName='more-menu-overlay' >
        <a className="ant-dropdown-link" href="">
          <MoreOutlined />
        </a>
      </Dropdown>
    }
  })
  if (loading) {
    return <NoContent content={<Spinner />} />
  } else {
    return (
      <div>
        <div className="deliverycomp_filters">
          <Row>
            <Col span={6}>
              <Select className="deliveryCompMultiselect"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                value={selectedRoutes || undefined}
                onChange={(e) => handleChange(e, 'selectedRoutes')}
              >
                {children}
              </Select>
            </Col>
            <Col span={12}>
              <Button type="primary" className="createNewDcbtn" onClick={() => { getDriversList(); setVisible(true) }}>
                <span><PlusOutlined /></span> <span>Create New DC</span>
              </Button>
            </Col>
            <Col span={6}>
              <Search className="deliveryCompSearchinput" placeholder="Search Challan" onSearch={value => console.log(value)} enterButton />
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
            onOk={() => onOk()}
            onCancel={() => onCancel()}
            footer={<div className="detailsmodalfooter">{!disabled && <Button type="primary" disabled={disabled} className="delivery_modalfoot_btn" onClick={() => createOrUpdateDc()}>{customerOrderId === '' ? "Save" : "Update"}</Button>}</div>}
          >
            <CreateDCModal disabled={disabled} routesInfo={routesInfo} errors={errors} routeId={routeId} dropDownChange={dropDownChange} inputChange={inputChange} driverId={driverId} driversList={driversList} inputData={inputData} handleChange={handleChange} />
          </Modal>
        </div>
      </div>
    );
  }
};

export default Delivery;