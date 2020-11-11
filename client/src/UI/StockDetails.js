import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, Button, Divider, Modal, Form, Checkbox, Input } from 'antd'
import { baseUrl } from '../config'
import { getAPI } from '../utils/apis';
import { getWarehoseId } from '../utils/constants';

const StockDetails = (props) => {
  const WAREHOUSEID = getWarehoseId()
  const [visible1, setVisible1] = useState(false);
  const [newStocks, setNewStocks] = useState([])
  const [outForDelivery, setoutForDelivery] = useState([])
  const [currentStocks, setCurrentStocks] = useState({})
  const currentDate = props.currentDate
  useEffect(() => {
    getActiveStocks();
    getOutForDelivery()
  }, [])
  const getActiveStocks = () => {
    let url = 'warehouse/currentActiveStockDetails?warehouseId=' + WAREHOUSEID
    getAPI(url).then(response => {
      if (response.data.length)
        setCurrentStocks(response.data[0])
    })
  }
  const getOutForDelivery = () => {
    let url = `warehouse/outForDeliveryDetails/${currentDate}?warehouseId=` + WAREHOUSEID
    getAPI(url).then(response => {
      if (response.data.length)
        setoutForDelivery(response.data[0])
    })
  }
  const confirmedBtn = (visible1) => {
    setVisible1({ visible1: true });
    getAPI('warehouse/getNewStockDetails/' + WAREHOUSEID).then(res => {
      setNewStocks()
    })
      .catch(error => {
        console.log(error)
      });
  }
  console.log("ccc", currentStocks)
  return (
    <div className="StockdetailsComponents">
      <div className="stockdetailstopdiv">
        <Row>
          <Col span={22}>
            <Row className="StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Current Active Stock</h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3 className="StockDetailsCounth3">{currentStocks.total20LCans}</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 1 Ltr Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{currentStocks.total1LBoxes}</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 500 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{currentStocks.total500MLBoxes}</h3>
              </Col>
              {/* <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 250 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{currentStocks.total250MLBoxes}</h3>
              </Col> */}
              <Divider type="vertical" />
              <Col span={6} className="divider_left">
                <Button type="primary" ghost className="confirmbtn getreportsbtn" onClick={() => { confirmedBtn(visible1) }}>Confirmed</Button>
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>
            <Row className="StockDetailsStatusRows">
              <Col span={4}>
                <h4>New arrived Stock</h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p>--</p>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p>--</p>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p>--</p>
              </Col>
            </Row>
          </Col>
        </Row>

      </div>
      <div className="stockdetailstop2nddiv">
        <Row className="MainStockdetailsRows">
          <Col span={22}>
            <Row className="SubStockdetailsRows StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Out For Delivery</h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3 className="StockDetailsCounth3">{outForDelivery.total20LCans}</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 1 Ltr Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{outForDelivery.total1LBoxes}</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 500 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{outForDelivery.total500MLBoxes}</h3>
              </Col>
              {/* <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 250 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">{outForDelivery.total250MLBoxes}</h3>
              </Col> */}
              <Divider type="vertical" />
              <Col span={6} className="divider_left">
                <Button type="primary" ghost className="getreportsbtn">21 - D.C Details</Button>
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>
            <Row className="StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Damaged Stock</h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 1 Ltr Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 500 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={6} className="divider_left">
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col span={22} className="SubStockdetailsRows emptyCanDetailsdiv">
            <h4 className="emptycandetailsh4">
              Empty Cans details
                    </h4>
            <p className="stockDetailsp">Empty and damged cans are not included in corrent stock details</p>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Row className="SubStockdetailsRows StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Empty Cans</h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={8} className="divider_left">
                <p className="stockDetailsp">Return to Mother Plant</p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" className="expandable_dividers" />
              <Col span={4} className="divider_left">
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>
            <Row className="SubStockdetailsRows StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Empty Recovery Cans </h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3 className="StockDetailsCounth3">0</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 1 Ltr Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">--</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 500 ml Boxes (1x12) </p>
                <h3 className="StockDetailsCounth3">--</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={6} className="divider_left">
                <Button type="primary" ghost className="getreportsbtn">View Details</Button>
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>
            <Row className="StockDetailsStatusRows">
              <Col span={4}>
                <h4 className="stockDetailsh4">Damaged Claims </h4>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total Cans (20 ltr)</p>
                <h3>123</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 1 Ltr Boxes (1x12) </p>
                <h3>12</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={4} className="divider_left">
                <p className="stockDetailsp">Total 500 ml Boxes (1x12) </p>
                <h3>128</h3>
              </Col>
              <Divider type="vertical" />
              <Col span={6} className="divider_left">
                <Button type="primary" ghost className="getreportsbtn">View Details</Button>
                <Button type="primary" ghost className="getreportsbtn">Get Reports</Button>
              </Col>
            </Row>

          </Col>
        </Row>

      </div>

      <div>
        <Modal className="createNewDCModal"
          title={<h3 className="deliverymodalheader">Stock Details</h3>}
          visible={visible1}
          onOk={() => { setVisible1(false) }}
          onCancel={() => { setVisible1(false) }}
          footer={<div className="detailsmodalfooter"><Button type="primary" className="delivery_modalfoot_btn">Confirm Stock Received</Button></div>}
        >
          {newStocks.length ? newStocks.map((stockDetails, index) => (<div>
            <div>
              <Row className="bbtm-1">
                <Col span={24}>
                  <h5 className="stockview_texth5">Delivery Calan Number (DC Number)</h5>
                  <h4 className="stockview_texth4">{stockDetails.MPDCNo}</h4>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding bbtm-1">
                <Col span={24}>
                  <h5 className="stockview_texth5">Location Details</h5>
                  <p className="stockview_textp">{stockDetails.Address}</p>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding bbtm-1">
                <Col span={24}>
                  <h5 className="stockview_texth5">Vehicle Details</h5>
                  <p className="stockview_textp">TS-19-AG-5465 - DCM Van</p>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding bbtm-1">
                <Col span={24}>
                  <h5 className="stockview_texth5">Contact Name and Number</h5>
                  <p className="stockview_textp"><span>{stockDetails.AdminName}</span>,<span>{stockDetails.AdminNumber}</span></p>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding bbtm-1">
                <Col span={24}>
                  <h5 className="stockview_texth5">Stock Particulars</h5>
                  <p className="stockview_textp">K.S Rama Rao,     09985752338</p>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding bbtm-1">
                <Col span={33}>
                  <h5 className="stockview_texth5">Return Stock Details (Damaged)</h5>
                  <Form>
                    <Row>
                      <Col span={2}>
                        <Form.Item>
                          <Checkbox className="stockmodalcheck" />
                        </Form.Item>
                      </Col>
                      <Col span={10} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">20 Ltrs</h5>
                          <Input placeholder="1500" value={stockDetails.damaged20LCans} />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">1 Ltrs (Box-1x12)</h5>
                          <Input placeholder="59" value={stockDetails.damaged1LBoxes} />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">500 ml (Box-1x12)</h5>
                          <Input placeholder="238" value={stockDetails.damaged500MLBoxes} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
            <div>
              <Row className="rowspadding">
                <Col span={33}>
                  <h5 className="stockview_texth5">Return Empty Cans</h5>
                  <Form>
                    <Row>
                      <Col span={2}>
                        <Form.Item>
                          <Checkbox className="stockmodalcheck" />
                        </Form.Item>
                      </Col>
                      <Col span={10} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">20 Ltrs</h5>
                          <Input placeholder="500" />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">1 Ltrs (Box-1x12)</h5>
                          <Input placeholder="--" />
                        </Form.Item>
                      </Col>
                      <Col span={6} className="padding-right_comp">
                        <Form.Item>
                          <h5 className="form_modal_label">500 ml (Box-1x12)</h5>
                          <Input placeholder="--" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
          )) : null}

        </Modal>
      </div>


    </div>
  )
}

export default StockDetails;